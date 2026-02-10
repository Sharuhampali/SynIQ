// // // "use client"

// // // import { useState } from "react"
// // // import { Input } from "@/components/ui/input"
// // // import { Button } from "@/components/ui/button"
// // // import { Textarea } from "@/components/ui/textarea"
// // // import { toast } from "sonner"

// // // export default function QueryPage() {
// // //   const [query, setQuery] = useState("")
// // //   type QueryResult = {
// // //     filename: string
// // //     chunk: string
// // //   }
// // //   const [results, setResults] = useState<QueryResult[]>([])
// // //   const [loading, setLoading] = useState(false)

// // //   const handleQuery = async () => {
// // //     setLoading(true)
// // //     try {
// // //       const res = await fetch("/api/query", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ query }),
// // //       })
// // //       const data = await res.json()
// // //       if (res.ok) {
// // //         setResults(data.results)
// // //       } else {
// // //         toast.error(data.error || "Query failed")
// // //       }
// // //     } catch (err) {
// // //       toast.error("Query error")
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className="max-w-2xl mx-auto py-12 px-4">
// // //       <h2 className="text-2xl font-bold mb-6">Ask a Question</h2>
// // //       <div className="space-y-4">
// // //         <Input
// // //           placeholder="e.g. What did we decide in Q1 marketing meeting?"
// // //           value={query}
// // //           onChange={(e) => setQuery(e.target.value)}
// // //         />
// // //         <Button onClick={handleQuery} disabled={!query || loading}>
// // //           {loading ? "Searching..." : "Search"}
// // //         </Button>
// // //         <div className="mt-8 space-y-4">
// // //           {results.length > 0 && <h3 className="font-semibold">Results:</h3>}
// // //           {results.map((res, i) => (
// // //             <div key={i} className="p-4 border rounded-lg bg-muted">
// // //               <p className="text-sm text-muted-foreground">File: {res.filename}</p>
// // //               <Textarea readOnly value={res.chunk} />
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }
// // "use client"

// // import { useState } from "react"

// // export default function QueryPage() {
// //   const [question, setQuestion] = useState("")
// //   const [answer, setAnswer] = useState("")

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     const res = await fetch("/api/query", {
// //       method: "POST",
// //       body: JSON.stringify({ query: question }),
// //     })
// //     const data = await res.json()
// //     setAnswer(data.answer)
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto p-6">
// //       <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>

// //       <form onSubmit={handleSubmit} className="mb-6">
// //         <textarea
// //           className="w-full border p-2 rounded"
// //           rows={4}
// //           value={question}
// //           onChange={(e) => setQuestion(e.target.value)}
// //         />
// //         <button
// //           type="submit"
// //           className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
// //         >
// //           Submit
// //         </button>
// //       </form>

// //       {answer && (
// //         <div className="bg-gray-100 p-4 rounded">
// //           <strong>Answer:</strong>
// //           <p>{answer}</p>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// "use client"

// import { useState } from "react"

// export default function QueryPage() {
//   const [question, setQuestion] = useState("")
//   const [answer, setAnswer] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const res = await fetch("/api/query", {
//       method: "POST",
//       body: JSON.stringify({ query: question }),
//     })
//     const data = await res.json()
//     setAnswer(data.answer)
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>

//       <form onSubmit={handleSubmit} className="mb-6">
//         <textarea
//           className="w-full border p-2 rounded"
//           rows={4}
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Submit
//         </button>
//       </form>

//       {answer && (
//         <div className="bg-gray-100 p-4 rounded">
//           <strong>Answer:</strong>
//           <p>{answer}</p>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MessageSquare,
  Send,
  Loader2,
  Brain,
  FileText,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react"
import { toast } from "sonner"

interface Source {
  filename: string
  chunk: string
  relevance?: number
}

interface QueryResult {
  answer: string
  sources?: Source[]
}

export default function QueryPage() {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
         if (data.sources) {
    localStorage.setItem(
      "usedDocs",
      JSON.stringify(data.sources.map((s: Source) => s.filename))
    )
  }

        toast.success("Query processed successfully!")
      } else {
        setError(data.error || "Failed to process query")
        toast.error(data.error || "Query failed")
      }
    } catch  {
      setError("Network error. Please check your connection and try again.")
      toast.error("Query error")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQuestion("")
    setResult(null)
    setError(null)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Answer copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const suggestedQuestions = [
    "What are the main topics discussed in the documents?",
    "Summarize the key findings from the research",
    "What decisions were made in the meeting?",
    "What are the project requirements?",
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <MessageSquare className="h-12 w-12 text-primary animate-float" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Ask a Question
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Query your uploaded documents using natural language. Our AI will search through your content and provide
          intelligent, contextual answers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Query Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-slide-up glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Your Question</span>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </CardTitle>
              <CardDescription>
                Ask anything about your uploaded documents. Be specific for better results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="e.g., What were the key decisions made in the Q1 marketing meeting? What are the main findings in the research report?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="resize-none pr-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="text-xs">
                      {question.length}/500
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="flex-1 group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                        Ask Question
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClear} disabled={loading}>
                    Clear
                  </Button>
                </div>
              </form>

              {/* Suggested Questions */}
              {!result && !loading && !error && (
                <div className="mt-6 space-y-3 animate-fade-in">
                  <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuestion(suggestion)}
                        className="justify-start text-left h-auto p-3 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-sm">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary animate-pulse" />
                  <span>AI is thinking...</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span>Searching through your documents...</span>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950/50 animate-scale-in">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-primary animate-pulse" />
                      <span>AI Answer</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.answer)}
                      className="hover:scale-110 transition-transform"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground">{result.answer}</p>
                  </div>
                </CardContent>
              </Card>

              {result.sources && result.sources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Source Documents</span>
                      <Badge variant="secondary">{result.sources.length} sources</Badge>
                    </CardTitle>
                    <CardDescription>Relevant excerpts from your documents that informed this answer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.sources.map((source, index) => (
                      <Card key={index} className="border-l-4 border-l-primary/50 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs font-mono">
                              {source.filename.replace("chunks-", "").replace(".json", "")}
                            </Badge>
                            {source.relevance && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(source.relevance * 100)}% relevant
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                                  {source.chunk}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="animate-fade-in glass-effect" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Query Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {[
                { icon: MessageSquare, text: "Be specific about what you are looking for" },
                { icon: Brain, text: "Ask about concepts, decisions, or findings" },
                { icon: FileText, text: "Reference specific topics or sections" },
                { icon: Zap, text: "Use natural language - no special syntax needed" },
              ].map((tip, index) => {
                const Icon = tip.icon
                return (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="p-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">{tip.text}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="animate-fade-in glass-effect" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-3">
                {[
                  "AI analyzes your question",
                  "Searches through document chunks",
                  "Finds most relevant content",
                  "Generates contextual answer",
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
