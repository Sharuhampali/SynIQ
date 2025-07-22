// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { toast } from "sonner"

// export default function UploadPage() {
//   const [file, setFile] = useState<File | null>(null)
//   const [uploading, setUploading] = useState(false)

//   const handleUpload = async () => {
//     if (!file) return

//     setUploading(true)
//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       })

//       const data = await res.json()
//       if (res.ok) {
//         toast.success(`Uploaded! ${data.chunksStored} chunks stored.`)
//       } else {
//         toast.error(data.error || "Upload failed.")
//       }
//     } catch (err) {
//       toast.error("Upload error.")
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="max-w-xl mx-auto py-12 px-4">
//       <h2 className="text-2xl font-bold mb-6">Upload Document</h2>
//       <div className="space-y-4">
//         <Label htmlFor="file">Choose a file</Label>
//         <Input
//           id="file"
//           type="file"
//           accept=".pdf,.txt,.docx"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//         />
//         <Button onClick={handleUpload} disabled={!file || uploading}>
//           {uploading ? "Uploading..." : "Upload"}
//         </Button>
//       </div>
//     </div>
//   )
// }
// app/upload/page.tsx
"use client";

import React from "react";

export default function UploadPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Upload File</h1>
      <form method="POST" action="/api/upload" encType="multipart/form-data">
        <input type="file" name="file" className="mb-4" />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
