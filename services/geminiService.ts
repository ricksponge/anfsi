import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

try {
    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
} catch (error) {
    console.error("Failed to initialize Gemini client", error);
}

export const sendMessageToGemini = async (history: Message[], newMessage: string): Promise<string> => {
  if (!ai) {
    // Fallback simulation if no API key is present for the demo
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Tactical simulation mode: API Key missing. Accessing local archives... Verified. How can I assist with your inquiry regarding digital forensics or cybersecurity?");
        }, 1500);
    });
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Convert our internal history to the format Gemini expects (roughly)
    // Ideally we would use a ChatSession, but for single-turn logic here:
    const contents = history
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.text}`)
        .join('\n');

    const fullPrompt = `
      System: You are the AI core of the ANFSI (Agence du Numérique des Forces de Sécurité Intérieure) Nexus. 
      You are a high-tech digital forensic assistant. 
      Keep answers concise, technical, and professional. 
      Use military/police digital terminology (e.g., "Affirmative", "Scanning", "Data correlate").
      
      Conversation History:
      ${contents}
      
      User: ${newMessage}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "Data corrupted. Retrying secure handshake...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection interrupted. Secure link unstable.";
  }
};