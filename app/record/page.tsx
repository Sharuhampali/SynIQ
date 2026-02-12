"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Loader2 } from "lucide-react"
import { toast } from "sonner"

/* =======================
   Web Speech API TYPES
   ======================= */

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

/* =======================
   COMPONENT
   ======================= */

export default function RecordPage() {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [liveText, setLiveText] = useState("")
  const [finalText, setFinalText] = useState("")

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  /* =======================
     START RECORDING
     ======================= */
  async function startRecording() {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!Recognition) {
      toast.error("Speech recognition not supported in this browser")
      return
    }

    try {
      // Force mic permission early
      await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  },
})


      const recognition = new Recognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ""
        let finalized = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result[0].transcript

          if (result.isFinal) {
            finalized += text + " "
          } else {
            interim += text
          }
        }

        if (finalized) {
          setFinalText(prev => prev + finalized)
        }

        setLiveText(interim)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // These errors are NORMAL – ignore them
        if (
          event.error === "no-speech" ||
          event.error === "aborted" ||
          event.error === "audio-capture"
        ) {
          return
        }

        toast.error(`Speech error: ${event.error}`)
      }

      recognition.onend = () => {
        // Chrome randomly stops recognition — restart it
        if (recording) {
          try {
            recognition.start()
          } catch {
            /* ignore */
          }
        }
      }

      recognition.start()
      recognitionRef.current = recognition
      setFinalText("")
      setLiveText("")
      setRecording(true)
    } catch {
      toast.error("Microphone access denied")
    }
  }

  /* =======================
     STOP RECORDING
     ======================= */
  async function stopRecording() {
    setRecording(false)
    recognitionRef.current?.stop()

    // 🔑 CRITICAL FIX: combine interim + final
    const transcript = (finalText + " " + liveText).trim()

    if (transcript.length === 0) {
      toast.error("No speech detected — speak louder or longer")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to generate notes")
      }

      toast.success("Lecture notes generated")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate notes"
      )
    } finally {
      setLoading(false)
      setLiveText("")
      setFinalText("")
    }
  }

  /* =======================
     UI
     ======================= */
  return (
    <div className="max-w-2xl mx-auto mt-20 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Lecture</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center gap-4">
            {!recording ? (
              <Button onClick={startRecording}>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopRecording}>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}

            {loading && <Loader2 className="animate-spin" />}
          </div>

          {(liveText || finalText) && (
            <div className="rounded-lg border p-4 bg-muted/50 text-sm whitespace-pre-wrap">
              <span className="opacity-60">{finalText}</span>
              <span className="italic text-primary">{liveText}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
