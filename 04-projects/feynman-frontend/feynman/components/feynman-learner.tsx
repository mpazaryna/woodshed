'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, StopCircle } from 'lucide-react'
import { useCompletion } from 'ai/react'

export function FeynmanLearnerComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/analyze',
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcript + ' ')
          } else {
            interimTranscript += transcript
          }
        }
      }
    }
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    setTranscript('')
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const analyzeTranscript = async () => {
    if (transcript) {
      await complete(transcript)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Feynman Learning Technique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button onClick={startRecording} disabled={isRecording}>
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording} variant="secondary">
              <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          </div>
          <Textarea
            placeholder="Your transcribed speech will appear here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={10}
          />
          <Button onClick={analyzeTranscript} disabled={isLoading || !transcript}>
            Analyze
          </Button>
          {completion && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{completion}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}