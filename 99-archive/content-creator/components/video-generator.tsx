"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TemplateOption {
  value: string
  label: string
  description: string
}

const templateOptions: TemplateOption[] = [
  {
    value: "default",
    label: "Standard Video Script",
    description: "A professional video script with clear sections and timing"
  },
  {
    value: "tiktok",
    label: "TikTok Script",
    description: "A short, engaging script optimized for TikTok (under 60 seconds)"
  },
  {
    value: "youtube",
    label: "YouTube Script",
    description: "A comprehensive script optimized for YouTube with sections and timestamps"
  }
]

const toneOptions: TemplateOption[] = [
  {
    value: "playful",
    label: "Playful",
    description: "A light-hearted, fun tone that engages with humor and creativity"
  },
  {
    value: "professional",
    label: "Professional",
    description: "A polished, business-appropriate tone that conveys expertise and authority"
  },
  {
    value: "bold",
    label: "Bold",
    description: "A confident, assertive tone that makes strong statements and stands out"
  },
  {
    value: "calm",
    label: "Calm",
    description: "A soothing, measured tone that reassures and builds trust"
  }
]

const lengthOptions: TemplateOption[] = [
  {
    value: "short",
    label: "Short",
    description: "A brief script for quick videos (1-2 minutes)"
  },
  {
    value: "medium",
    label: "Medium",
    description: "A moderate-length script (3-5 minutes)"
  },
  {
    value: "long",
    label: "Long",
    description: "A comprehensive script for in-depth videos (6+ minutes)"
  }
]

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("default")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")

  const generateVideoScript = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          templateType: "video",
          templateName,
          tone,
          length
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video script")
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error generating video script:", error)
      setResult("Sorry, there was an error generating your video script. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={generateVideoScript} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="template">Script Type</Label>
            <Select
              value={templateName}
              onValueChange={setTemplateName}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {templateOptions.find(t => t.value === templateName)?.description}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select
              value={tone}
              onValueChange={setTone}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {toneOptions.find(t => t.value === tone)?.description}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="length">Script Length</Label>
            <Select
              value={length}
              onValueChange={setLength}
            >
              <SelectTrigger id="length">
                <SelectValue placeholder="Select a length" />
              </SelectTrigger>
              <SelectContent>
                {lengthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {lengthOptions.find(l => l.value === length)?.description}
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Describe the video script you'd like to generate:
          </Label>
          <Textarea
            id="prompt"
            placeholder="e.g., A product explainer video for our new AI-powered content creation tool"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
            required
          />
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading || !prompt.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Video Script"
          )}
        </Button>
      </form>

      {result && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">
              {templateName === "tiktok" ? "TikTok Script" :
               templateName === "youtube" ? "YouTube Script" : "Video Script"}
            </h2>
            <div className="whitespace-pre-wrap">{result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
