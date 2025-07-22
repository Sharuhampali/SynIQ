// import mammoth from "mammoth"
// import pdfParse from "pdf-parse"

// /**
//  * Extracts raw text from PDF, DOCX, or TXT files.
//  * Throws an error for unsupported formats.
//  */
// export async function extractTextFromFile(file: Blob): Promise<string> {
//   const buffer = await file.arrayBuffer()
//   const uint8Array = new Uint8Array(buffer)

//   // Try to access file name if it's a File, fallback to default
//   const fileName =
//     "name" in file && typeof file.name === "string"
//       ? file.name.toLowerCase()
//       : "uploaded_file"

//   if (fileName.endsWith(".pdf")) {
//     const bufferData = Buffer.from(uint8Array);
//     const data = await pdfParse(bufferData);
//     return data.text.trim();
//   }

//   if (fileName.endsWith(".docx")) {
//     const bufferData = Buffer.from(uint8Array);
//     const result = await mammoth.extractRawText({ buffer: bufferData })
//     return result.value.trim()
//   }

//   if (fileName.endsWith(".txt")) {
//     return new TextDecoder().decode(uint8Array).trim()
//   }

//   throw new Error(`Unsupported file type: ${fileName}. Only .pdf, .docx, and .txt are allowed.`)
// }
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { read, utils as xlsxUtils } from "xlsx";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "uploaded_files", "chunks_db.json");
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf-8");

export async function extractTextFromFile(filePath: string, fileName: string): Promise<string> {
  const ext = path.extname(fileName).toLowerCase();
  try {
    if (ext === ".pdf") {
      const data = fs.readFileSync(filePath);
      const result = await pdfParse(data);
      return result.text;
    }
    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }
    if (ext === ".xlsx") {
      const workbook = read(fs.readFileSync(filePath));
      let text = "";
      workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        text += xlsxUtils.sheet_to_csv(sheet);
      });
      return text;
    }
    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf-8");
    }
    throw new Error("Unsupported file type");
  } catch (err) {
    console.error("Text extraction failed:", err);
    throw err;
  }
}

export async function chunkAndEmbed(fileName: string, text: string) {
  const words = text.split(/\s+/);
  const chunkSize = 512;
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunkText = words.slice(i, i + chunkSize).join(" ");
    if (chunkText.trim().length === 0) continue;

    const embedding = hash(chunkText);
    chunks.push({ file: fileName, chunk: chunkText, embedding });
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  db.push(...chunks);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function text_similarity(a: string, b: string): number {
  const aWords = new Set(a.toLowerCase().split(/\s+/));
  const bWords = new Set(b.toLowerCase().split(/\s+/));
  const shared = [...aWords].filter(w => bWords.has(w)).length;
  return shared / Math.max(aWords.size, 1);
}

export async function searchChunksForQuery(query: string) {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  let best = null;
  let bestScore = -1;

  for (const chunk of db) {
    const score = text_similarity(chunk.chunk, query);
    if (score > bestScore) {
      bestScore = score;
      best = chunk;
    }
  }

  if (!best) return { answer: "No matching content found" };

  return {
    answer: best.chunk.slice(0, 500) + "...",
    sourceFile: best.file
  };
}
