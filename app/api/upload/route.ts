
// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";

// // Utility to split text into chunks
// function splitTextIntoChunks(text: string, maxChunkSize = 500): string[] {
//   const paragraphs = text.split(/\n{2,}/); // Split by double newlines.
//   const chunks: string[] = [];
//   let currentChunk = "";

//   for (const para of paragraphs) {
//     if ((currentChunk + "\n\n" + para).length > maxChunkSize) {
//       if (currentChunk) chunks.push(currentChunk.trim());
//       currentChunk = para;
//     } else {
//       currentChunk += "\n\n" + para;
//     }
//   }

//   if (currentChunk) chunks.push(currentChunk.trim());
//   return chunks;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Get file contents
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     let text: string;

//     // === Basic text decode (assumes text file) ===
//     try {
//       text = buffer.toString("utf8");
//     } catch (e) {
//       return NextResponse.json({ error: "Unable to decode file as text" }, { status: 400 });
//     }

//     // === Split content into chunks ===
//     const chunks = splitTextIntoChunks(text);

//     // === Save to chunk JSON file ===
//     const uploadDir = path.join(process.cwd(), "chunks");
//     await fs.mkdir(uploadDir, { recursive: true });

//     const chunksFileName = `chunks-${file.name}.json`;
//     const chunksFilePath = path.join(uploadDir, chunksFileName);
//     await fs.writeFile(chunksFilePath, JSON.stringify({ chunks }, null, 2));

//     return NextResponse.json({
//       message: "File processed and chunks saved",
//       chunksFilePath,
//       chunkCount: chunks.length
//     });
//   } catch (error) {
//     console.error("Chunking error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Utility to split text into chunks
function splitTextIntoChunks(text: string, maxChunkSize = 500): string[] {
  const paragraphs = text.split(/\n{2,}/); // Split by double newlines.
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if ((currentChunk + "\n\n" + para).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += "\n\n" + para;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get file contents
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let text: string;

    // === Basic text decode (assumes text file) ===
    try {
      text = buffer.toString("utf8");
    } catch (e) {
      return NextResponse.json({ error: "Unable to decode file as text" }, { status: 400 });
    }

    // === Split content into chunks ===
    const chunks = splitTextIntoChunks(text);

    // === Save to chunk JSON file ===
    const uploadDir = path.join(process.cwd(), "chunks");
    await fs.mkdir(uploadDir, { recursive: true });

    const chunksFileName = `chunks-${file.name}.json`;
    const chunksFilePath = path.join(uploadDir, chunksFileName);
    await fs.writeFile(chunksFilePath, JSON.stringify({ chunks }, null, 2));

    return NextResponse.json({
      message: "File processed and chunks saved",
      chunksFilePath,
      chunkCount: chunks.length
    });
  } catch (error) {
    console.error("Chunking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
