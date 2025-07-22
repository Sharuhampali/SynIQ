// export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
//   const sentences = text.split(/(?<=[.?!])\s+/)
//   const chunks: string[] = []

//   let chunk: string[] = []
//   let length = 0

//   for (const sentence of sentences) {
//     const sentenceLength = sentence.length

//     if (length + sentenceLength > chunkSize) {
//       chunks.push(chunk.join(" ").trim())

//       // Start next chunk with overlap
//       chunk = chunk.slice(-Math.floor(overlap / 10))
//       length = chunk.join(" ").length
//     }

//     chunk.push(sentence)
//     length += sentenceLength
//   }

//   if (chunk.length > 0) {
//     chunks.push(chunk.join(" ").trim())
//   }

//   return chunks
// }
import fs from "fs/promises"
import path from "path"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from "langchain/document"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

// Define the chunk interface
export interface Chunk {
  content: string
  embedding: number[]
}

// Load your API key from env
const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error("❌ GOOGLE_API_KEY is not set in environment variables.")
}

export async function generateChunksFromText(text: string): Promise<Chunk[]> {
  // Step 1: Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs: Document[] = await splitter.createDocuments([text])

  // Step 2: Get embeddings using Google
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey,
    modelName: "embedding-001", // default for Gemini embeddings
  })

  const embeddedChunks: Chunk[] = []

  for (const doc of docs) {
    const embedding = await embeddings.embedQuery(doc.pageContent)
    embeddedChunks.push({
      content: doc.pageContent,
      embedding,
    })
  }

  return embeddedChunks
}

export async function saveChunksToFile(chunks: Chunk[]) {
  const filePath = path.join(process.cwd(), "data", "chunks.json")
  await fs.mkdir(path.dirname(filePath), { recursive: true }) // Ensure dir exists
  await fs.writeFile(filePath, JSON.stringify(chunks, null, 2), "utf8")
  console.log(`✅ Chunks saved to: ${filePath}`)
}
