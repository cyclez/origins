import { askGemini } from './ai-handlers/gemini.js'
import { askClaude } from './ai-handlers/claude.js';
import { askRandom } from './ai-handlers/random.js';
import { askGroq } from './ai-handlers/gpt.js';
import { askOllama } from './ai-handlers/ollama.js';

export const godsData = {
    names: ['Agnostic', 'Gemini', 'Claude', 'Random', 'GPT', 'Ollama'],
    handlers: [null, askGemini, askClaude, askRandom, askGroq, askOllama],

    getName(id) {
        return this.names[id];
    },

    getHandler(id) {
        return this.handlers[id];
    },

    async invoke(id, creaturesData, lastAction) {
        return await this.handlers[id](creaturesData, lastAction);
    }
};

// Uso:
// import { gods } from './entities/gods/gods.js';
// gods.names[5] // 'Ollama'
// await gods.invoke(5, data, action)