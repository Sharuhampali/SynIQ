import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const NOTES_DIR = path.join(process.cwd(), "notes")

interface NoteMeta {
  id: number
  createdAt: string
  notes: string
}

export async function GET() {
  try {
    await fs.mkdir(NOTES_DIR, { recursive: true })
    const files = await fs.readdir(NOTES_DIR)

    const notes: NoteMeta[] = []

    for (const file of files) {
      const raw = await fs.readFile(path.join(NOTES_DIR, file), "utf8")
      const parsed = JSON.parse(raw) as NoteMeta
      notes.push(parsed)
    }

    notes.sort((a, b) => b.id - a.id)

    return NextResponse.json(notes)
  } catch (err) {
    console.error("[Notes API Error]", err)
    return NextResponse.json([], { status: 500 })
  }
}
