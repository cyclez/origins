// ═══════════════════════════════════════════════════════════════════════════
// WORLD CONFIGURATION
// Parameters for targets, temples, terrain, and physics
// ═══════════════════════════════════════════════════════════════════════════

export const WorldConfig = {

    // ─────────────────────────────────────────────────────────────────────────
    // TARGET SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    targets: {
        collection: {
            radius: 1,            // Distance to collect (Math.hypot < 1)
            verticalCheck: 2,     // Max Y difference (t.box.position.y - c.body.position.y < 2)
        },

        states: {
            uncaptured: 0,        // Green cube - free to collect
            captured: 1,          // Brown cube - being carried
            carrying: 2,          // White cube - in transit to temple
            placed: 3,            // In temple structure
        },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // TEMPLE SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    temples: {
        placement: {
            radius: 9,            // Distance to place block (h < 9)
            gridSize: 3,          // 3×3 grid per level
            blocksPerLevel: 9,    // 3×3 = 9 blocks
            blockSize: 1,         // Unit size
        },

        construction: {
            baseHeight: 3,        // terrain.getHeight() + 3
            levelHeight: 1,       // +1 per level
        },

        // Temple positions initialized dynamically
        // Format: [x, z, blockIndex]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // TERRAIN GENERATION
    // ─────────────────────────────────────────────────────────────────────────
    terrain: {
        seed: null,               // Random if null (Math.random() * 100)
        heightScale: 100,         // Max height variation
        frequency: 0.01,          // Feature spread
        octaves: 4,               // Noise layers
        amplitudeDecay: 0.5,      // Each octave contributes less
        frequencyGain: 2,         // Each octave has finer detail
        heightDivisor: 6,         // Final height / 6
    },

    // ─────────────────────────────────────────────────────────────────────────
    // WORLD BOUNDARIES
    // ─────────────────────────────────────────────────────────────────────────
    boundaries: {
        mapSize: 64,              // ±64 units
        creatureClamp: 63.5,      // Creature movement limit
        targetClamp: 63.5,        // Target respawn limit
    },

    // ─────────────────────────────────────────────────────────────────────────
    // PHYSICS
    // ─────────────────────────────────────────────────────────────────────────
    physics: {
        gravity: -9.82,           // World gravity (CANNON.Vec3(0, -9.82, 0))

        blockThrow: {
            angle: Math.PI / 4,   // 45 degrees launch angle
            // Formula in placeblock():
            // const denom = 2 * Math.cos(angle)² * (d * Math.tan(angle) - dy)
        }
    }
};

export default WorldConfig;
