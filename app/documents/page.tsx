"use client"

import { useEffect, useState } from "react"
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DocumentFile {
  name: string
  size: number
  uploadedAt: number
  url: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest">("newest")
  const [preview, setPreview] = useState<DocumentFile | null>(null)
  const [usedDocs, setUsedDocs] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then(setDocuments)

    const used =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("usedDocs") || "[]")
        : []

    setUsedDocs(used)
  }, [])

  const filtered = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) =>
    sort === "newest"
      ? b.uploadedAt - a.uploadedAt
      : a.uploadedAt - b.uploadedAt
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Documents</h1>
        <p className="text-muted-foreground">
          Browse, preview, and manage your uploaded files
        </p>
      </div>

      <Card className="glass-effect">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Uploaded Files</span>
            <Badge variant="secondary">{documents.length}</Badge>
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 py-2 rounded-md border bg-background text-sm"
              />
            </div>

            <select
              aria-label="Sort documents"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "newest" | "oldest")
              }
              className="border rounded-md px-2 py-2 text-sm bg-background"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="divide-y">
          {sorted.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No documents found
            </div>
          ) : (
            sorted.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between py-4 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatSize(doc.size)}</span>
                      {usedDocs.includes(doc.name) && (
                        <Badge variant="secondary">Used in answer</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Button size="sm" variant="outline" onClick={() => setPreview(doc)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>

                  <Button size="sm" variant="ghost" asChild>
                    <a href={doc.url} download>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm(`Delete ${doc.name}?`)) return
                      await fetch(doc.url, { method: "DELETE" })
                      setDocuments((d) => d.filter((x) => x.name !== doc.name))
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background w-[80%] h-[80%] rounded-lg p-4 relative">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 text-muted-foreground"
            >
              ✕
            </button>

            {preview.name.endsWith(".pdf") ? (
              <iframe src={preview.url} className="w-full h-full rounded" />
            ) : (
              <div className="text-muted-foreground text-center mt-10">
                Preview not supported for this file type
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
