export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Falta la API KEY en Vercel" });
  }

  // URL directa de Google (sin usar librerías externas)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: `Actúa como SyntaxBit, experto en SQL. Convierte esto a código SQL: ${prompt}` }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Extraer el texto de la respuesta de Google
    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: text });

  } catch (error) {
    res.status(500).json({ error: "Error de red o conexión" });
  }
}
