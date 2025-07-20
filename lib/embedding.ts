import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Use Gemini to extract semantic vector by simulating embedding via hidden layers (approximate)
export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "embedding-001" })

  const result = await model.embedContent({
    content: { role: "user", parts: [{ text }] },
  })

  return result.embedding.values
}

export async function embedChunks(chunks: string[]): Promise<number[][]> {
  const model = genAI.getGenerativeModel({ model: "embedding-001" })

  const promises = chunks.map(chunk =>
    model.embedContent({
      content: { role: "user", parts: [{ text: chunk }] },
    }).then(res => res.embedding.values)
  )

  return await Promise.all(promises)
}
