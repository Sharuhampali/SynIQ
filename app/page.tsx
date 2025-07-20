// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">🧠 SynIQ</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Secure AI-powered organizational memory. Upload documents, ask questions, get context.
      </p>
      <div className="space-x-4">
        <Link href="/upload">
          <Button>Upload Document</Button>
        </Link>
        <Link href="/query">
          <Button variant="outline">Ask a Question</Button>
        </Link>
      </div>
    </main>
  )
}
