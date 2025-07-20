export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const sentences = text.split(/(?<=[.?!])\s+/)
  const chunks: string[] = []

  let chunk: string[] = []
  let length = 0

  for (const sentence of sentences) {
    const sentenceLength = sentence.length

    if (length + sentenceLength > chunkSize) {
      chunks.push(chunk.join(" ").trim())

      // Start next chunk with overlap
      chunk = chunk.slice(-Math.floor(overlap / 10))
      length = chunk.join(" ").length
    }

    chunk.push(sentence)
    length += sentenceLength
  }

  if (chunk.length > 0) {
    chunks.push(chunk.join(" ").trim())
  }

  return chunks
}
