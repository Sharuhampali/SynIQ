import { NextResponse } from "next/server"
import { embedText } from "@/lib/embedding"
import { searchChunksInSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { query } = await req.json()

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  try {
    const queryEmbedding = await embedText(query)
    const results = await searchChunksInSupabase(queryEmbedding)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Query Error:", error)
    return NextResponse.json({ error: "Failed to query knowledge base" }, { status: 500 })
  }
}
