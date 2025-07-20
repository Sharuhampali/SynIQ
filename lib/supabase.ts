import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function storeChunksInSupabase(filename: string, chunks: string[]) {
  const { embedChunks } = await import("./embedding")
  const embeddings = await embedChunks(chunks)

  const payload = chunks.map((chunk, i) => ({
    filename,
    content: chunk,
    embedding: embeddings[i],
  }))

  const { error } = await supabase.from("chunks").insert(payload)

  if (error) {
    throw new Error("Failed to store chunks: " + error.message)
  }
}

export async function searchChunksInSupabase(queryEmbedding: number[]) {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.75,
    match_count: 5,
  })

  if (error) {
    throw new Error("Search failed: " + error.message)
  }

  type ChunkRow = {
    filename: string;
    content: string;
    similarity: number;
  };

  return data.map((row: ChunkRow) => ({
    filename: row.filename,
    chunk: row.content,
    similarity: row.similarity,
  }))
}
