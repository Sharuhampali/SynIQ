import mammoth from "mammoth"
import pdfParse from "pdf-parse"

/**
 * Extracts raw text from PDF, DOCX, or TXT files.
 * Throws an error for unsupported formats.
 */
export async function extractTextFromFile(file: Blob): Promise<string> {
  const buffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)

  // Try to access file name if it's a File, fallback to default
  const fileName =
    "name" in file && typeof file.name === "string"
      ? file.name.toLowerCase()
      : "uploaded_file"

  if (fileName.endsWith(".pdf")) {
    const bufferData = Buffer.from(uint8Array);
    const data = await pdfParse(bufferData);
    return data.text.trim();
  }

  if (fileName.endsWith(".docx")) {
    const bufferData = Buffer.from(uint8Array);
    const result = await mammoth.extractRawText({ buffer: bufferData })
    return result.value.trim()
  }

  if (fileName.endsWith(".txt")) {
    return new TextDecoder().decode(uint8Array).trim()
  }

  throw new Error(`Unsupported file type: ${fileName}. Only .pdf, .docx, and .txt are allowed.`)
}
