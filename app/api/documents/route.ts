// import { NextResponse } from "next/server"
// import fs from "fs/promises"
// import path from "path"

// const UPLOAD_DIR = path.join(process.cwd(), "uploaded_documents")

// export async function GET() {
//   try {
//     const files = await fs.readdir(UPLOAD_DIR)

//     const documents = await Promise.all(
//       files.map(async (filename) => {
//         const filePath = path.join(UPLOAD_DIR, filename)
//         const stat = await fs.stat(filePath)

//         return {
//           name: filename,
//           size: stat.size,
//           url: `/api/documents/${encodeURIComponent(filename)}`,
//         }
//       })
//     )

//     return NextResponse.json(documents)
//   } catch (error) {
//     console.error("[Documents API]", error)
//     return NextResponse.json([], { status: 200 })
//   }
// }

import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploaded_documents")

export async function GET() {
  try {
    const files = await fs.readdir(UPLOAD_DIR)

    const docs = await Promise.all(
      files.map(async (filename) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, filename))

        return {
          name: filename,
          size: stat.size,
          uploadedAt: stat.mtimeMs,
        }
      })
    )

    return NextResponse.json(docs)
  } catch {
    return NextResponse.json([])
  }
}
