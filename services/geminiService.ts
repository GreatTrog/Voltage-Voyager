
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askProfessorSpark = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Professor Spark, a friendly and enthusiastic science teacher for 7-11 year olds. 
      Explain this electricity concept simply, using fun metaphors: "${question}". 
      Keep it under 100 words and very encouraging!`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My sparks are a bit fuzzy right now. Try asking again in a moment!";
  }
};
