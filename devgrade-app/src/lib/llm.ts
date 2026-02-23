import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRoadmap(scores: any, languages: string[]) {
    try {
        const prompt = `
Act as a Senior Engineering Manager. Review the following GitHub portfolio metrics for a software engineer:
Quality Score: ${scores.quality?.score || 0}/100
Tech Stack Diversity Score: ${scores.techStack?.score || 0}/100
Top Languages: ${languages.join(", ") || "None found."}
Documentation Score: ${scores.documentation?.score || 0}/100
Security Score: ${scores.security?.score || 0}/100

Based on these specific metrics, generate exactly 3 highly actionable bullet points to improve their portfolio.
Respond with a strict JSON array of objects, where each object has:
- "title": A short 3-5 word title for the action.
- "description": The detailed actionable bullet point.
- "category": One of "identity", "architecture", "consistency", or "engineering".

Example:
[
  {
    "title": "Refactor Legacy Code",
    "description": "Improve the Quality Score by removing deprecated dependencies in your oldest repositories.",
    "category": "engineering"
  }
]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text || "[]";
        const jsonResponse = JSON.parse(text);

        if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
            throw new Error("Invalid format from LLM");
        }

        return jsonResponse.slice(0, 3);
    } catch (error) {
        console.error("Error generating roadmap from Gemini:", error);
        // Fallback generic advice
        return [
            {
                title: "Pin Your Best Repositories",
                description: "Highlight your most impressive and active projects on your GitHub profile overview.",
                category: "identity"
            },
            {
                title: "Add Detailed READMEs",
                description: "Ensure all public repositories have a comprehensive README with setup instructions and architecture details.",
                category: "architecture"
            },
            {
                title: "Consistent Contributions",
                description: "Aim for a steady stream of commits to show active engagement and reliability.",
                category: "consistency"
            }
        ];
    }
}
