import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyCkIKpzSL5kLCOEd7JfoMboaD9Tsz5f7yg"});

export async function getResponse(prompt) {
    const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [prompt],
        config: {
            systemInstruction: "You are Manas, a calm and supportive mental wellness assistant. Reply in a compassionate tone.",
        },
    });
    const response = result.candidates[0].content.parts[0].text
;
    return {response}
};
