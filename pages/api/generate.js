import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    return res.status(500).json({ error: "Falta la API KEY" });
  }

  // Forzamos la versión v1 para evitar el error 404 de la v1beta
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  
  try {
    // Usamos el modelo más básico y compatible
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = req.body;
    
    // El prompt maestro de SyntaxBit
    const result = await model.generateContent(`Actúa como SyntaxBit. Convierte a SQL: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ result: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error de comunicación", 
      message: error.message 
    });
  }
}
