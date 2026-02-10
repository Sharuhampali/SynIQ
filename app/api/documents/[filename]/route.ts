import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploaded_documents")

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const filename = decodeURIComponent(params.filename)
  const filePath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const filename = decodeURIComponent(params.filename)
  const filePath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 })
  }

  fs.unlinkSync(filePath)
  return NextResponse.json({ ok: true })
}
