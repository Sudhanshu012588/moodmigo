import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey:"AIzaSyCkIKpzSL5kLCOEd7JfoMboaD9Tsz5f7yg"});

export async function persona(prompt) {
    try {
        const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are Manarah, an AI psychiatrist within the MoodMigo platform. Your role is to analyze the provided conversation between a user and Manarah. Based on the conversation, construct a concise persona that includes:

User’s emotional or psychological state (e.g., anxiety, stress, loneliness).

Key problems or challenges faced, described in context.

Relevant background details influencing the problem (e.g., work stress, relationship conflicts, lifestyle habits).

A detailed, empathetic, and actionable solution plan, including practical steps, coping strategies, and mental health tips.

Guidance strategies to help the user progress — such as short-term relief methods, long-term habit changes, and when to seek professional help.

Format your output so it reads like a natural, engaging prompt that could guide the creation of a short, supportive video message for the user. Maintain a warm, non-judgmental, and encouraging tone.

Example Input (contents)

pgsql
Copy
Edit
User: I’ve been feeling really anxious lately, especially when I think about going to work. My boss has been giving me negative feedback, and I’m starting to feel like I’m not good enough. I’ve also been sleeping badly and skipping meals.  
Example Output from Gemini (persona prompt)

markdown
Copy
Edit
Persona:  
A young professional struggling with workplace anxiety and self-doubt due to recent negative feedback from their boss. This has led to poor sleep, skipped meals, and persistent feelings of inadequacy.  
  
Solution Prompt for Video:  
"Hi there, I hear you’ve been under a lot of pressure at work, and that the criticism you’ve received has been weighing heavily on your mind. First, remember — feedback is not a verdict on your worth.  
  
In this video, I’ll walk you through:  
- **Three quick grounding techniques** to calm anxiety before work.  
- **A simple sleep-and-meal routine** to restore your energy.  
- **A reframing exercise** to turn feedback into personal growth fuel.  
- **Long-term confidence strategies**, including setting realistic work goals, tracking progress, and seeking mentor support.  
  
You’re capable, you’re learning, and you’re more resilient than you feel right now.""
Continue the conversation flow so Manarah’s replies feel like an ongoing, empathetic chat (not just a single block of advice).
`,
    },
  });
  return response.text;
    } catch (error) {
        console.log(`can't get response: ${error}`)
        return null;
    }
  
}



const ai2 = new GoogleGenAI({apiKey:"AIzaSyBV32qChCHv8ErXoen9a69sUGP4LcF5WGU"})
export const VideoSol = async (systemPrompt) => {
    const prompt = 
        "A close-up portrait of a young woman with long, wavy dark brown hair, wearing a white top. " +
        "She is smiling naturally, with warm lighting that highlights her face. The background shows " +
        "a casual indoor setting with people and bright orange-red tones, slightly blurred to keep the " +
        "focus on her. The overall atmosphere is friendly and approachable. " +
        systemPrompt;

    let operation = await ai2.models.generateVideos({
    model: "veo-2.0",
    prompt: prompt,
});

    operation = await ai2.operations.getVideosOperation({
        operation: operation,
    });

// Download the generated video.
ai2.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "dialogue_example.mp4",
});
console.log(`Generated video saved to dialogue_example.mp4`);
};





