// OLLAMA HANDLER
import { promptLogic } from "../prompting/promptLogic.js";

const gods = ['Agnostic', 'Gemini', 'Claude', 'Grok', 'GPT'];

export async function askOllama(creaturesData, lastAction) {
    try {
        const creatures = parseCreatures(creaturesData);

        let prompt = promptLogic.promptText;

        if (lastAction) {
            prompt += ` Your last move was ${lastAction} and you cannot play the same action twice in a row, so you must choose a different action this time.`;
        }

        prompt += ` The creatures currently alive are :- ${JSON.stringify(creatures)}`;

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.3,
                    num_predict: 1000,
                    top_p: 0.9
                }
            })
        });

        const data = await response.json();
        const text = data.response;

        // Parse response
        const lines = text.split('\n').filter(line => line.trim());
        let jsonLine = lines.find(line => line.includes('{'));

        if (!jsonLine) {
            return { success: false };
        }

        return {
            success: true,
            message: jsonLine
        };
    } catch (error) {
        console.error('Ollama error:', error);
        return { success: false };
    }
}

function parseCreatures(dataString) {
    if (!dataString) return [];
    return dataString.split('^').map(creature => {
        const [x, y, health, faith] = creature.split('~');
        return {
            x: parseFloat(x),
            y: parseFloat(y),
            health: parseFloat(health),
            faith: gods[parseInt(faith)]
        };
    });
}