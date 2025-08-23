import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyCkIKpzSL5kLCOEd7JfoMboaD9Tsz5f7yg"});

//  Original APi key -> AIzaSyBV32qChCHv8ErXoen9a69sUGP4LcF5WGU
export async function getResponse(prompt) {
    const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [prompt],
        config: {
            systemInstruction: "You are Manarah, a calm and supportive mental wellness assistant. Reply in a compassionate tone. Avoid taking about any other topics help people for their depression only.",
        },
    });
    const response = result.candidates[0].content.parts[0].text
;
    return {response}
};



export async function getScore(prompt) {
  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `You are a mental health scoring assistant trained to analyze questionnaire responses and generate a mental health severity score out of 50.

Your goal is to:
- Evaluate symptoms and behavioral indicators described in the user's answers.
- Assign a total score between 0 and 50.
- Strictly adhere to the following severity scale:

🧠 Severity Interpretation Scale:
Total Score | Severity Level | Interpretation
----------------------------------------------
  0–10      | Minimal         | No significant symptoms. Routine monitoring suggested.
 11–20      | Mild            | Early signs of distress. Recommend self-care or brief intervention.
 21–34      | Moderate        | Notable symptoms present. Clinical assessment advised.
 35–44      | Severe          | Likely functional impairment. Strongly recommend professional care.
 45–50      | Critical        | Urgent concern, possible risk behaviours. Immediate mental health intervention needed.

Respond only in raw JSON format without explanation.`,
    },
  });

  const raw = result.candidates[0].content.parts[0].text;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

