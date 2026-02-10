import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { googleGemini } from "@/lib/gemini"

const NOTES_DIR = path.join(process.cwd(), "notes")

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json()

    if (typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is empty" },
        { status: 400 }
      )
    }

    const prompt = `
You are an expert note-taking assistant.

Convert the following lecture transcript into:
- Clear headings
- Bullet points
- Definitions
- Examples (if present)

Transcript:
${transcript}
`

    const notes = await googleGemini(prompt, "")

    const id = Date.now()
    const note = {
      id,
      transcript,
      notes,
      createdAt: new Date().toISOString(),
    }

    await fs.mkdir(NOTES_DIR, { recursive: true })
    await fs.writeFile(
      path.join(NOTES_DIR, `note-${id}.json`),
      JSON.stringify(note, null, 2)
    )

    return NextResponse.json({ success: true, note })
  } catch (err) {
    console.error("[Generate Notes Error]", err)
    return NextResponse.json(
      { error: "Failed to generate notes" },
      { status: 500 }
    )
  }
}
