import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permiten peticiones POST' });
  }

  // 1. Inicializar Gemini con tu API Key de Vercel
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { prompt } = req.body;

  try {
    // 2. Definir el contexto de SyntaxBit (El Prompt Maestro)
    const promptMaestro = `
      Actúa como un experto en SQL para la marca SyntaxBit. 
      Tu objetivo es convertir lenguaje natural en código SQL optimizado.
      Usuario pregunta: ${prompt}
      Responde únicamente con el código SQL dentro de bloques de código y una breve explicación.
    `;

    const result = await model.generateContent(promptMaestro);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: "Error conectando con Gemini" });
  }
}