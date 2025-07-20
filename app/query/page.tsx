"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function QueryPage() {
  const [query, setQuery] = useState("")
  type QueryResult = {
    filename: string
    chunk: string
  }
  const [results, setResults] = useState<QueryResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleQuery = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (res.ok) {
        setResults(data.results)
      } else {
        toast.error(data.error || "Query failed")
      }
    } catch (err) {
      toast.error("Query error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Ask a Question</h2>
      <div className="space-y-4">
        <Input
          placeholder="e.g. What did we decide in Q1 marketing meeting?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleQuery} disabled={!query || loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
        <div className="mt-8 space-y-4">
          {results.length > 0 && <h3 className="font-semibold">Results:</h3>}
          {results.map((res, i) => (
            <div key={i} className="p-4 border rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">File: {res.filename}</p>
              <Textarea readOnly value={res.chunk} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
