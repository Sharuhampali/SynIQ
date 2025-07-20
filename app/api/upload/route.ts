import { NextResponse } from "next/server"
import { extractTextFromFile } from "@/lib/extract"
import { chunkText } from "@/lib/chunks"
import { storeChunksInSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  try {
    const text = await extractTextFromFile(file)
    const chunks = chunkText(text)

    await storeChunksInSupabase(file.name, chunks)

    return NextResponse.json({ success: true, chunksStored: chunks.length })
  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
