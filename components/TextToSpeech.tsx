"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export default function TextToSpeech({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false)

  const speak = () => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <>
      {!speaking ? (
        <Button onClick={speak} size="sm" variant="secondary">
          <Volume2 className="mr-2 h-4 w-4" />
          Listen
        </Button>
      ) : (
        <Button onClick={stop} size="sm" variant="destructive">
          <VolumeX className="mr-2 h-4 w-4" />
          Stop
        </Button>
      )}
    </>
  )
}
