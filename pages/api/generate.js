import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Verificar que la API KEY existe
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    return res.status(500).json({ error: "Falta la API KEY en Vercel" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(`Actúa como SyntaxBit, un experto en SQL. Convierte esto a SQL: ${prompt}`);
    const response = await result.response;
    
    res.status(200).json({ result: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de conexión con Gemini", details: error.message });
  }
}
