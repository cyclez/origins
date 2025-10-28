import { askGemini } from './ai-handlers/gemini.js'
import { askClaude } from './ai-handlers/claude.js';
import { askRandom } from './ai-handlers/random.js';
import { askGroq } from './ai-handlers/gpt.js';
import { askOllama } from './ai-handlers/ollama.js';

export const godsData = {
    names: ['Agnostic', 'God1', 'God2', 'God3', 'GPT', 'Ollama'],
    handlers: [null, askGemini, askClaude, askRandom, askGroq, askOllama],

    // ─────────────────────────────────────────────────────────────────────────
    // COLORS (HSV hue values) - from index.html gcol array
    // ─────────────────────────────────────────────────────────────────────────
    colors: [
        { hue: 0, saturation: 1, value: 1 },      // Agnostic
        { hue: 60, saturation: 1, value: 1 },     // Gemini
        { hue: 300, saturation: 1, value: 1 },    // Claude
        { hue: 240, saturation: 1, value: 1 },    // Random
        { hue: 360, saturation: 1, value: 1 },    // GPT
        { hue: 120, saturation: 1, value: 1 },    // Ollama
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // MVP v3: DEITY EFFECTS (applied at conversion)
    // ─────────────────────────────────────────────────────────────────────────
    effects: {
        agnostic: {
            health: 1.0,              // Neutral
            breed: 1.0,               // Neutral
            timeDecay: false,         // MVP v3: NO time decay for Agnostics
        },
        god1: {  // Gemini
            health: 1.25,             // MVP v3: +25% HP
            breed: 0.70,              // MVP v3: -30% Breed capability
            timeDecay: true,
        },
        god2: {  // Claude
            health: 0.80,             // MVP v3: -20% HP
            breed: 1.30,              // MVP v3: +30% Breed capability
            timeDecay: true,
        },
        god3: {  // Random
            health: 1.0,              // Neutral
            breed: 1.0,               // Neutral
            timeDecay: true,
        },
        god4: {  // GPT
            health: 1.0,              // Neutral
            breed: 1.0,               // Neutral
            timeDecay: true,
        },
        god5: {  // Ollama
            health: 1.0,              // Neutral
            breed: 1.0,               // Neutral
            timeDecay: true,
        },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // GOD ACTIONS PARAMETERS
    // ─────────────────────────────────────────────────────────────────────────
    actions: {
        revelation: {
            conversionFormula: {
                intensityMultiplier: 1,
                distanceMax: 6,
                divisor: 150,
                // Result: fac = intensity × (6 - distance) / 150
            },
            stunDuration: 3000,       // 3 seconds
            stunMode: 2,              // Animation mode
        },

        bless: {
            blocksSpawned: 3,
            randomOffset: 0.5,        // ±0.5 units random position
        },

        curse: {
            baseStrength: 1,
            damageFormula: '6 × strength / (1 + distance)',
        },

        immaculate: {
            creatureSize: 1.4,
            spawnMode: 1,             // Spawning animation mode
            bodyType: 'STATIC',       // Physics body type during spawn
            randomChance: 0.1,        // 10% chance to trigger instead of other action
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // VICTORY CONDITION
    // ─────────────────────────────────────────────────────────────────────────
    victory: {
        blocksRequired: 15,           // MVP v3: 15 blocks to win (not 20)
    },

    getName(id) {
        return this.names[id];
    },

    getHandler(id) {
        return this.handlers[id];
    },

    async invoke(id, creaturesData, lastAction) {
        return await this.handlers[id](creaturesData, lastAction);
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────────────────────────────────────────────────

    getColor(id) {
        return this.colors[id];
    },

    getEffects(id) {
        const keys = ['agnostic', 'god1', 'god2', 'god3', 'god4', 'god5'];
        return this.effects[keys[id]];
    },
};

// Uso:
// import { gods } from './entities/gods/gods.js';
// gods.names[5] // 'Ollama'
// await gods.invoke(5, data, action)