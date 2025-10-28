export default async function handler(req, res) {
    const { creatures, lastAction } = req.query;

    // Per Ollama non serve API key, ma manteniamo la struttura
    res.json({
        creatures,
        lastAction
    });
}