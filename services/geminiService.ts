import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, MediaType } from "../types";

// In a real app, this key comes from environment variables
const API_KEY = process.env.API_KEY || '';

export const generateAIQuiz = async (topic: string = "Tamil Cinema 90s hits"): Promise<Question[]> => {
  if (!API_KEY) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Generate 5 challenging quiz questions about ${topic} in the context of Tamil Pop Culture (Kollywood).
  Provide the output in JSON format compatible with the schema provided.
  The questions should be multiple choice (RADIO).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              points: { type: Type.NUMBER },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING }
            },
            required: ["text", "points", "options", "correctAnswer"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    // Transform into our internal format
    return rawData.map((q: any, index: number) => ({
      id: `ai-gen-${Date.now()}-${index}`,
      text: q.text,
      mediaType: MediaType.NONE,
      questionType: QuestionType.RADIO,
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: q.points || 10
    }));

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
