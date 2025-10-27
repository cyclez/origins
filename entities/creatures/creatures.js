
// ═══════════════════════════════════════════════════════════════════════════
// CREATURES CONFIGURATION
// Game logic parameters for creature entities
// ═══════════════════════════════════════════════════════════════════════════

export const CreatureConfig = {

    // ─────────────────────────────────────────────────────────────────────────
    // INITIAL SPAWN PARAMETERS
    // ─────────────────────────────────────────────────────────────────────────
    spawn: {
        health: 100,                    // Starting HP (CURRENT: always 100, MVP: 30-40 random)
        size: 1.4,                      // Visual scale multiplier
        faith: 0,                       // 0=Agnostic, 1-4=God IDs
        mode: 0,                        // 0=normal, 1-4=special states
        cooldown: 0,                    // Frames until behavior change
        lockedTarget: 0,                // Current target ID (0=none)

        // ❌ NOT IMPLEMENTED (from MVP):
        // breed: Math.random() * 100,  // Fertility 0-100
        // devotion: Math.random() * 100, // Religious dedication 0-100
        // sex: Math.random() < 0.5 ? 'M' : 'F'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // PHYSICS PARAMETERS (CANNON.js Body)
    // ─────────────────────────────────────────────────────────────────────────
    physics: {
        mass: 5,                        // Body mass
        shape: {
            type: 'cylinder',
            radiusTop: 0.2,
            radiusBottom: 0.6,
            height: 1.3,
            segments: 16
        },
        angularDamping: 0.9,            // Rotation friction
        linearDamping: 0.5,             // Movement friction
        heightOffset: 1.2               // Multiplier: size × 1.2 above terrain
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HEALTH SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    health: {
        initial: 100,                   // Starting HP
        max: 100,                       // HP cap (MVP: hard limit)
        min: 0,                         // Death threshold (CURRENT: ≤0, MVP: soft-lock at <20)

        // Health decay per frame (60 FPS)
        decay: {
            baseRate: 0.01,               // Base decay coefficient
            sizeScaling: true,            // If true: decay = baseRate × √size
            // Formula: health -= 0.03 × Math.sqrt(creatureSize)
            // Examples:
            // - Size 1.0: -1.8 HP/s → death in ~55 seconds
            // - Size 2.0: -2.5 HP/s → death in ~39 seconds
        },

        // Health restoration
        targetCollection: {
            hpGain: 20,                   // HP restored per target
            sizeGrowth: 1.1,              // Size multiplier (×1.1 = +10%)
            collectionRadius: 1,          // Distance threshold
            verticalCheck: 2              // Max Y distance
        },

        // Damage from Danger
        dangerDamage: {
            baseMultiplier: 6,            // Base damage coefficient
            formula: 'baseMultiplier × strength / distance',
            // distance = 1 + hypot(dx, dy) to avoid division by zero
            checkRadius: 3                // Detection range
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // MOVEMENT PARAMETERS
    // ─────────────────────────────────────────────────────────────────────────
    movement: {
        speed: 0.1,                     // Units per frame
        boundaryClamp: 63.5,            // Max distance from origin

        methods: {
            // moveToward(x, z, speed): move towards target
            // moveAway(x, z, speed): flee from target
            // Both use atan2 for angle calculation
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // BEHAVIOR SYSTEM (Autonomous Actions)
    // ─────────────────────────────────────────────────────────────────────────
    behavior: {

        // Cooldown between behavior changes
        cooldown: {
            min: 250,                     // Minimum frames (~4.2 seconds)
            max: 450,                     // Maximum frames (~7.5 seconds)
            // Formula: 250 + Math.random() × 200

            exceptions: {
                rest: 200,                  // Shorter cooldown for rest
                findblock: 99999            // Locked until block placed
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // ACTION PROBABILITY SYSTEM (getProgram function)
        // ═══════════════════════════════════════════════════════════════════════

        actions: {

            // ─────────────────────────────────────────────────────────────────────
            // HAVEREST - Idle wandering
            // ─────────────────────────────────────────────────────────────────────
            haverest: {
                probability: 0.2,           // 20% base chance
                healthModifier: {
                    threshold: 25,            // HP threshold
                    bonus: 0,                 // ⚠️ BUG: no bonus when low HP (should be high)
                },
                cooldown: 200,              // Frames
                description: 'Stand still, no resource interaction',
                implementation: 'Empty function - literally does nothing'
            },

            // ─────────────────────────────────────────────────────────────────────
            // EVADE - Flee from nearby creatures
            // ─────────────────────────────────────────────────────────────────────
            evade: {
                probability: 0.2,           // 20% base (range: 0.2-0.4)
                healthModifier: {
                    threshold: 25,
                    bonus: 0.4,               // ⚠️ BUG: increases evade when wounded
                },
                detectionRadius: 5,         // Search range for threats
                description: 'Move away from nearest creature',
                note: '⚠️ COSMETIC ONLY - no creature-creature damage exists'
            },

            // ─────────────────────────────────────────────────────────────────────
            // FINDBLOCK - Collect building materials
            // ─────────────────────────────────────────────────────────────────────
            findblock: {
                probability: 0.3,           // 30% base (range: 0.4-0.7)
                healthModifier: {
                    threshold: 25,
                    bonus: 0.4,
                },
                cooldown: 99999,            // Locked until completion
                description: 'Find captured target, change to white material',
                chains_to: 'placeblock'     // Automatic progression
            },

            // ─────────────────────────────────────────────────────────────────────
            // PURSUE - Hunt for resources (main survival action)
            // ─────────────────────────────────────────────────────────────────────
            pursue: {
                probability: 0.3,           // 30% base (range: 0.7-1.0)
                healthModifier: {
                    threshold: 25,
                    bonus: 0.4,               // ⚠️ BUG: MORE aggressive when wounded
                },
                collectionRadius: 1,
                verticalCheck: 2,
                description: 'Chase nearest uncaptured target, gain +20 HP and +10% size',
                onSuccess: {
                    healthGain: 20,
                    sizeMultiplier: 1.1,
                    newBehavior: 'random'     // Calls getProgram()
                }
            },

            // ─────────────────────────────────────────────────────────────────────
            // PLACEBLOCK - Temple construction
            // ─────────────────────────────────────────────────────────────────────
            placeblock: {
                probability: 0,             // Not random - only via findblock
                templeRadius: 9,            // Distance to temple for placement
                description: 'Carry white block to faith temple, throw with physics',
                physics: {
                    launchAngle: Math.PI / 4, // 45 degrees
                    gravity: 9.82
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // ACTUAL PROBABILITY CALCULATION
        // ═══════════════════════════════════════════════════════════════════════

        probabilityFormula: {
            description: `
          let r = Math.random();
          if (health < 25) r += 0.4;  // ⚠️ INVERTED LOGIC
          
          if (r < 0.2) return haverest;
          if (r < 0.4) return evade;
          if (r < 0.7) return findblock;
          return pursue;
        `,

            resultingProbabilities: {
                when_healthy: {
                    haverest: '20%',
                    evade: '20%',
                    findblock: '30%',
                    pursue: '30%'
                },
                when_wounded: {
                    haverest: '0%',           // ⚠️ SHOULD BE HIGH
                    evade: '10%',
                    findblock: '30%',
                    pursue: '60%'             // ⚠️ SHOULD BE LOW
                }
            },

            bug_explanation: `
          CRITICAL BUG: When health < 25, creatures become MORE aggressive
          instead of defensive. The +0.4 bonus shifts distribution towards
          pursue instead of rest. This is counterintuitive and likely unintended.
          
          EXPECTED BEHAVIOR:
          - Low HP → prioritize rest/evade (survival)
          - High HP → prioritize pursue/findblock (resource gathering)
          
          ACTUAL BEHAVIOR:
          - Low HP → 60% pursue (aggressive hunting while wounded)
          - High HP → balanced distribution
        `
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // FAITH SYSTEM (Religion/Conversion)
    // ─────────────────────────────────────────────────────────────────────────
    faith: {
        gods: ['Agnostic', 'Gemini', 'Claude', 'Amazon-Nova', 'GPT'],
        colors: [0, 60, 300, 240, 360],  // HSV hue values

        initialFaith: 0,                 // 0 = Agnostic at spawn
        conversionLimit: 1,              // Can only convert once (permanent)

        // Conversion happens via Revelation (external - not creature action)
        // Formula: fac = intensity × (6 - distance) / 150
        // Check: if (Math.random() < fac) convert
    },

    // ─────────────────────────────────────────────────────────────────────────
    // TARGET FINDING LOGIC
    // ─────────────────────────────────────────────────────────────────────────
    targetFinding: {
        findTarget: {
            description: 'Find nearest target by capture state',
            levels: {
                0: 'Uncaptured targets (green cubes)',
                1: 'Captured but not placed (brown cubes)',
                2: 'Placed in temple (static white blocks)'
            },
            algorithm: 'Euclidean distance, returns target ID or 0'
        },

        findNearest: {
            description: 'Find nearest creature (for evade)',
            maxDistance: 5,
            returns: 'Creature index or -1'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SPECIAL MODES (Animation States)
    // ─────────────────────────────────────────────────────────────────────────
    modes: {
        0: {
            name: 'NORMAL',
            description: 'Standard behavior execution',
            physics: 'DYNAMIC'
        },
        1: {
            name: 'SPAWNING',
            description: 'Immaculate birth - rising from ground',
            duration: 4000,               // 4 seconds
            physics: 'STATIC',
            yOffset: 'life/2000 - 2'      // Rises gradually
        },
        2: {
            name: 'REVELATION_STUN',
            description: 'Caught in divine light - shrinking',
            duration: 3000,               // 3 seconds
            physics: 'STATIC',
            scale: '1 - life/4500',
            rotation: 'life/500, 0, life/800'
        },
        3: {
            name: 'TRANSITION',
            description: 'Pause before respawn',
            duration: 1000,               // 1 second
            physics: 'STATIC'
        },
        4: {
            name: 'RESPAWN',
            description: 'Growing back to full size',
            duration: 'variable',         // Until height ≥ 30
            physics: 'STATIC',
            yOffset: '30 - 4×(life/1000)²',
            scale: 'ht/30'                // ht = height offset
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SIZE SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    size: {
        initial: 1.4,                   // Default spawn size
        growth: 1.1,                    // +10% per target collected
        effects: {
            visualScale: true,            // scale.setScalar(size)
            healthDecay: true,            // decay × √size
            physicsHeight: true           // 1.2 × size above terrain
        },
        unlimited: true                 // No max size cap
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON WITH MVP DESIGN
// ═══════════════════════════════════════════════════════════════════════════

export const MVPComparison = {
    implemented: [
        'Health system (spawn, decay, collection)',
        'Faith system (initial, conversion)',
        'Movement (pursue, evade, rest)',
        'Size scaling',
        'Target collection',
        'Death at HP ≤ 0'
    ],

    missing: [
        'Breed attribute (0-100)',
        'Devotion attribute (0-100)',
        'Sex attribute (M/F)',
        'BREED action (reproduction)',
        'BUILD action (HP donation to temple)',
        'GATHER explicit action (replaced by pursue)',
        'Cooldown timers (5-8 minutes post-action)',
        'HP spawn range 30-40 (always 100)',
        'Soft-lock at HP < 20 (currently dies at ≤0)',
        'Action probability based on breed/devotion'
    ],

    bugs: [
        'Wounded creatures become MORE aggressive (inverse health modifier)',
        'EVADE is cosmetic only (no creature-creature damage)',
        'Health always 100 at spawn (should be 30-40)',
        'No minimum HP threshold for actions (MVP: 20 for gather, 70 for breed/build)'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMULA REFERENCE
// ═══════════════════════════════════════════════════════════════════════════

export const Formulas = {
    healthDecay: 'health -= 0.03 × √creatureSize',
    dangerDamage: 'health -= 6 × strength / (1 + distance)',
    behaviorCooldown: '250 + Math.random() × 200',
    behaviorProbability: 'r = random(); if (health < 25) r += 0.4',
    sizeGrowth: 'size *= 1.1',
    conversionChance: 'fac = intensity × (6 - distance) / 150',
    targetDistance: '√((x₁-x₂)² + (z₁-z₂)²)',
    movementAngle: 'atan2(dz, dx)'
};

export default CreatureConfig;