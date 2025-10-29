// ============================================================================
// CREATURES CONFIGURATION MODULE
// Unified Creature System with internal getProgram logic
// ============================================================================
import { TimingConfig } from '../../backend/timingConfig.js'; // external timing

export function creatureLogic() {
    // Internal config (formerly CreatureConfig)
    const CreatureConfig = {
        spawn: {
            health: 70,
            size: 1.4,
            faith: 0,
            mode: 0,
            cooldown: 0,
            lockedTarget: 0,
            creatureNumber: 20,
            breed: () => Math.random() * 100,
            devotion: () => Math.random() * 100
        },

        behavior: {
            cooldown: { min: 250, max: 450 },
            actions: {
                haveRest: { probability: 0.2, cooldown: 200 },
                evade: { probability: 0.2 },
                findblock: { probability: 0.3, cooldown: 99999 },
                pursue: { probability: 0.3 }
            }
        }
    };

    // Internal helper functions (simplified references)
    function haveRest() { return 'haveRest'; }
    function evade() { return 'evade'; }
    function findblock() { return 'findblock'; }
    function pursue() { return 'pursue'; }

    // Unified logic (was getProgram)
    function getProgram(creatures, me) {
        if (me < 0 || me >= creatures.length || !creatures[me]) {
            console.warn('getProgram called with invalid me:', me);
            return haveRest;
        }

        let r = Math.random();
        creatures[me].lockedTarget = 0;

        // cooldown boundaries from TimingConfig
        const cooldownMin = TimingConfig.creatures.behavior.min;
        const cooldownMax = TimingConfig.creatures.behavior.max;
        creatures[me].cooldown = cooldownMin + Math.random() * (cooldownMax - cooldownMin);

        const pursueThreshold = CreatureConfig.behavior.actions.pursue.healthModifier?.threshold ?? 25;
        const pursueBonus = CreatureConfig.behavior.actions.pursue.healthModifier?.bonus ?? 0.4;

        if (creatures[me].health < pursueThreshold) r += pursueBonus;

        if (r < 0.2) {
            creatures[me].cooldown = TimingConfig.creatures.behavior.rest;
            return haveRest;
        }
        if (r < 0.4) return evade;
        if (r < 0.7) {
            creatures[me].cooldown = TimingConfig.creatures.actions.findblock;
            return findblock;
        }
        return pursue;
    }

    // Return both the configuration and logic together
    return { CreatureConfig, getProgram };
}

// Default export for convenience
export default creatureLogic;