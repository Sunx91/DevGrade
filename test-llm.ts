import { GoogleGenAI } from "@google/genai";

async function main() {
    console.log("Starting test...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Test prompt. Reply strictly with the JSON: [{\"title\": \"test\", \"description\": \"test\", \"category\": \"identity\"}]",
            config: {
                responseMimeType: "application/json",
            }
        });
        console.log("Success!");
        console.log(response.text);
    } catch (e: any) {
        console.error("Failed:");
        console.error(e.message);
    }
}

main();
