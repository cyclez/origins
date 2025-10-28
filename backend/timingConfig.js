// ═══════════════════════════════════════════════════════════════════════════
// TIMING CONFIGURATION
// All time-based parameters in the game
// ═══════════════════════════════════════════════════════════════════════════

export const TimingConfig = {

    // ─────────────────────────────────────────────────────────────────────────
    // GAME LOOP
    // ─────────────────────────────────────────────────────────────────────────
    game: {
        fps: 60,
        physicsStep: 1 / 60,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // GOD ACTIONS
    // ─────────────────────────────────────────────────────────────────────────
    gods: {
        firstActionDelay: 2000,   // ms - delay before first askGod() call
    },

    // ─────────────────────────────────────────────────────────────────────────
    // CREATURE COOLDOWNS (in frames @ 60fps)
    // ─────────────────────────────────────────────────────────────────────────
    creatures: {
        behavior: {
            min: 250,             // ~4.2 seconds
            max: 450,             // ~7.5 seconds
            rest: 200,            // ~3.3 seconds
        },

        actions: {
            breed: 60 * 60,       // MVP v3: 1 minute
            postBreed: 60 * 60,   // MVP v3: 1 minute after breed
            newborn: 60 * 60,     // MVP v3: 1 minute (newborn cooldown)
            findblock: 99999,     // Locked until block placed
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ANIMATION MODES (in milliseconds)
    // ─────────────────────────────────────────────────────────────────────────
    modes: {
        spawning: {
            duration: 4000,       // Mode 1: 4 seconds
            yOffsetFormula: 'life/2000 - 2',
        },

        revelationStun: {
            duration: 3000,       // Mode 2: 3 seconds
            scaleFormula: '1 - life/4500',
            rotationFormula: 'life/500, 0, life/800',
        },

        transition: {
            duration: 1000,       // Mode 3: 1 second
        },

        respawn: {
            heightThreshold: 30,  // Mode 4: until height >= 30
            yOffsetFormula: '30 - 4×(life/1000)²',
            scaleFormula: 'ht/30',
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // MVP v3: NEW ACTION DURATIONS
    // ─────────────────────────────────────────────────────────────────────────
    actions: {
        breed: {
            duration: 30 * 60,    // 30 seconds @ 60fps = 1800 frames
            frozen: true,         // Entity cannot move
        },

        cry: {
            maxDuration: -1,      // Infinite until helped
            frozen: true,
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

    // Convert seconds to frames
    secondsToFrames(seconds) {
        return seconds * this.game.fps;
    },

    // Convert frames to seconds
    framesToSeconds(frames) {
        return frames / this.game.fps;
    },

    // Convert milliseconds to frames
    msToFrames(ms) {
        return (ms / 1000) * this.game.fps;
    }
};

export default TimingConfig;
