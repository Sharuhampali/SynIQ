// // "use client"

// // import { useState } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { toast } from "sonner"

// // export default function UploadPage() {
// //   const [file, setFile] = useState<File | null>(null)
// //   const [uploading, setUploading] = useState(false)

// //   const handleUpload = async () => {
// //     if (!file) return

// //     setUploading(true)
// //     const formData = new FormData()
// //     formData.append("file", file)

// //     try {
// //       const res = await fetch("/api/upload", {
// //         method: "POST",
// //         body: formData,
// //       })

// //       const data = await res.json()
// //       if (res.ok) {
// //         toast.success(`Uploaded! ${data.chunksStored} chunks stored.`)
// //       } else {
// //         toast.error(data.error || "Upload failed.")
// //       }
// //     } catch (err) {
// //       toast.error("Upload error.")
// //     } finally {
// //       setUploading(false)
// //     }
// //   }

// //   return (
// //     <div className="max-w-xl mx-auto py-12 px-4">
// //       <h2 className="text-2xl font-bold mb-6">Upload Document</h2>
// //       <div className="space-y-4">
// //         <Label htmlFor="file">Choose a file</Label>
// //         <Input
// //           id="file"
// //           type="file"
// //           accept=".pdf,.txt,.docx"
// //           onChange={(e) => setFile(e.target.files?.[0] || null)}
// //         />
// //         <Button onClick={handleUpload} disabled={!file || uploading}>
// //           {uploading ? "Uploading..." : "Upload"}
// //         </Button>
// //       </div>
// //     </div>
// //   )
// // }
// // app/upload/page.tsx
// "use client";

// import React from "react";

// export default function UploadPage() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">Upload File</h1>
//       <form method="POST" action="/api/upload" encType="multipart/form-data">
//         <input type="file" name="file" className="mb-4" />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// }
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Zap, Brain, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    chunkCount?: number
  } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (
      droppedFile &&
      (droppedFile.type.includes("pdf") || droppedFile.type.includes("text") || droppedFile.name.endsWith(".docx"))
    ) {
      setFile(droppedFile)
      setUploadResult(null)
      setUploadProgress(0)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setUploadResult(null)
    setUploadProgress(0)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Animated progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 300)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await res.json()

      if (res.ok) {
        setUploadResult({
          success: true,
          message: `Document processed successfully! ${data.chunkCount || 0} intelligent chunks created.`,
          chunkCount: data.chunkCount,
        })
        toast.success("Document uploaded and processed!")
        setFile(null)
        const fileInput = document.getElementById("file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed. Please try again.",
        })
        toast.error(data.error || "Upload failed")
      }
    } catch {
      setUploadResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      })
      toast.error("Upload error")
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <Upload className="h-12 w-12 text-primary animate-float" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Upload Document
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transform your documents into intelligent, searchable knowledge. Upload PDF, DOCX, or TXT files to get
          started.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-slide-up glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>File Upload</span>
                {uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </CardTitle>
              <CardDescription>Drag and drop your file or click to browse. Maximum file size: 10MB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div
                      className={`p-4 rounded-full transition-all duration-300 ${
                        dragActive ? "bg-primary/20 scale-110" : "bg-muted"
                      }`}
                    >
                      <Upload
                        className={`h-8 w-8 transition-colors ${
                          dragActive ? "text-primary animate-bounce" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {dragActive ? "Drop your file here!" : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">DOCX</Badge>
                    <Badge variant="secondary">TXT</Badge>
                  </div>
                </div>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* File Preview */}
              {file && (
                <div className="animate-scale-in">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{file.type || "Unknown type"}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="animate-pulse">
                          Ready
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 animate-pulse text-primary" />
                      <span>Processing with AI...</span>
                    </div>
                    <span className="font-mono">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 animate-pulse" />
                    <span>Analyzing content and creating intelligent chunks...</span>
                  </div>
                </div>
              )}

              {/* Upload Result */}
              {uploadResult && (
                <Alert
                  className={`animate-scale-in ${
                    uploadResult.success
                      ? "border-green-500/50 bg-green-50 dark:bg-green-950/50"
                      : "border-red-500/50 bg-red-50 dark:bg-red-950/50"
                  }`}
                >
                  {uploadResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription
                    className={
                      uploadResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                    }
                  >
                    {uploadResult.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Document...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Upload & Process
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="animate-fade-in glass-effect" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI Processing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {[
                { icon: Upload, text: "Secure document upload" },
                { icon: Brain, text: "AI-powered content analysis" },
                { icon: Zap, text: "Intelligent chunk creation" },
                { icon: CheckCircle, text: "Ready for queries" },
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="p-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">{step.text}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="animate-fade-in glass-effect" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { format: "PDF", description: "Portable Document Format", icon: "📄" },
                { format: "DOCX", description: "Microsoft Word Document", icon: "📝" },
                { format: "TXT", description: "Plain Text File", icon: "📃" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.format}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
