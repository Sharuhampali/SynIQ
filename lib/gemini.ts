const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

type GeminiRequest = {
  contents: {
    parts: { text: string }[];
    role: "user";
  }[];
};

export async function googleGemini(query: string, context: string): Promise<string> {
  if (!GOOGLE_API_KEY) {
    throw new Error("Missing Google API Key.")
  }

  const prompt = `Use the following context to answer the user's query.\n\nContext:\n${context}\n\nQuery: ${query}`;

  const body: GeminiRequest = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini API request failed: ${res.status} ${res.statusText}\n${errorBody}`);
  }

  const result = await res.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
}
