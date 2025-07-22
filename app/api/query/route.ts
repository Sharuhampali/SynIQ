
// import { NextResponse } from "next/server"
// import { embedText } from "@/lib/embedding"
// import fs from "fs/promises"
// import path from "path"

// // Type for one file's content
// interface ChunkFile {
//   chunks: string[]
// }

// // Internal type for scoring similarity
// interface ScoredChunk {
//   filename: string
//   text: string
//   embedding: number[]
//   score: number
// }

// export async function POST(req: Request) {
//   try {
//     const { query }: { query: string } = await req.json()
//     if (!query) {
//       return NextResponse.json({ error: "Missing query" }, { status: 400 })
//     }

//     const queryEmbedding = await embedText(query)

//     const chunksDir = path.join(process.cwd(), "chunks")
//     const filenames = await fs.readdir(chunksDir)

//     const allScoredChunks: ScoredChunk[] = []

//     for (const file of filenames) {
//       if (!file.endsWith(".json")) continue

//       const filePath = path.join(chunksDir, file)
//       const fileData = await fs.readFile(filePath, "utf-8")
//       const parsed: ChunkFile = JSON.parse(fileData)

//       if (!Array.isArray(parsed.chunks)) continue

//       // Embed each chunk at query time
//       const embeddedChunks = await Promise.all(
//         parsed.chunks.map(async (text) => {
//           const embedding = await embedText(text)
//           const score = dotProduct(queryEmbedding, embedding)
//           return { filename: file, text, embedding, score }
//         })
//       )

//       allScoredChunks.push(...embeddedChunks)
//     }

//     // Sort by similarity (descending)
//     allScoredChunks.sort((a, b) => b.score - a.score)

//     const topResults = allScoredChunks.slice(0, 5).map((chunk) => ({
//       filename: chunk.filename,
//       text: chunk.text,
//       score: chunk.score
//     }))

//     return NextResponse.json({ results: topResults })
//   } catch (error) {
//     console.error("Query Error:", error)
//     return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
//   }
// }

// // Simple dot product (you can switch to cosine similarity if needed)
// function dotProduct(a: number[], b: number[]): number {
//   return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0)
// }
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { embedText } from "@/lib/embedding"
import { googleGemini } from "@/lib/gemini"

const chunksDir = path.join(process.cwd(), "chunks")

interface ChunkFile {
  chunks: string[]
}

interface ScoredChunk {
  filename: string
  text: string
  score: number
}

export async function POST(req: Request) {
  console.log("[Query API] Incoming query request...")

  const { query } = await req.json()
  console.log("[Query API] Query received:", `"${query}"`)

  const queryEmbedding = await embedText(query)
  console.log("[Query API] Query embedding length:", queryEmbedding.length)

  const files = await fs.readdir(chunksDir)
  console.log("[Query API] Found", files.length, "files in /chunks")

  const scoredChunks: ScoredChunk[] = []

  for (const filename of files) {
    const filePath = path.join(chunksDir, filename)
    const data = JSON.parse(await fs.readFile(filePath, "utf-8")) as ChunkFile
    console.log(`[Query API] Processing ${data.chunks.length} chunks from ${filename}`)

    for (const text of data.chunks) {
      const embedding = await embedText(text)
      const score = cosineSimilarity(queryEmbedding, embedding)
      scoredChunks.push({ filename, text, score })
    }
  }

  scoredChunks.sort((a, b) => b.score - a.score)
  console.log("[Query API] Total scored chunks:", scoredChunks.length)

  const topChunks = scoredChunks.slice(0, 5).map((chunk) => chunk.text)
  const context = topChunks.join("\n\n")

  console.log("[Query API] Sending retrieved context to Gemini...")

  const answer = await googleGemini(query, context)

  console.log("[Query API] Gemini answered.")
  return NextResponse.json({ answer })
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (normA * normB)
}
