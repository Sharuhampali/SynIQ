import * as pdfjs from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.entry"

export async function extractPdfTextClient(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  let text = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
    text += "\n\n"
  }

  return text.trim()
}
