import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploaded_documents")

export async function GET(
  _req: NextRequest,
  context: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(context.params.filename)
    const filePath = path.join(UPLOAD_DIR, filename)

    await fs.access(filePath)

    const buffer = await fs.readFile(filePath)

    // Convert Buffer → Uint8Array (Fetch-compatible)
    const uint8Array = new Uint8Array(buffer)

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(context.params.filename)
    const filePath = path.join(UPLOAD_DIR, filename)

    await fs.access(filePath)
    await fs.unlink(filePath)

    return NextResponse.json({ ok: true })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
