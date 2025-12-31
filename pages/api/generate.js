export default async function handler(req, res) {
  // 1. Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  // 2. Verificar API Key
  if (!apiKey) {
    console.error("ERROR: No se encontró GOOGLE_GEMINI_API_KEY en Vercel");
    return res.status(500).json({ error: "Configuración incompleta: falta API Key" });
  }

  // 3. Intentar conexión con URL estable
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Actúa como SyntaxBit. Genera solo el código SQL para: ${prompt}` }] }]
      })
    });

    const data = await response.json();

    // 4. Revisar si Google devolvió un error
    if (data.error) {
      console.error("Google API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 5. Validar que la respuesta tenga el formato esperado
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ result: text });
    } else {
      console.error("Estructura de respuesta inesperada:", JSON.stringify(data));
      return res.status(500).json({ error: "Respuesta de IA vacía o malformada" });
    }

  } catch (err) {
    console.error("Error en el servidor:", err);
    return res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
}
