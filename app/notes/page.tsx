"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Note {
  id: number
  notes: string
  createdAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-16 space-y-6">
      <h1 className="text-3xl font-bold">Your Lecture Notes</h1>

      {loading && (
        <>
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </>
      )}

      {!loading && notes.length === 0 && (
        <p className="text-muted-foreground">No notes yet.</p>
      )}

      {notes.map(note => (
        <Card key={note.id}>
          <CardHeader>
            <CardTitle>
              {new Date(note.createdAt).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
              {note.notes}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
