"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TemplateOption {
  value: string
  label: string
  description: string
}

const templateOptions: TemplateOption[] = [
  {
    value: "default",
    label: "Standard Social Media Post",
    description: "A standard social media post with a catchy headline and relevant content"
  },
  {
    value: "instagram",
    label: "Instagram Post",
    description: "An Instagram-optimized post with a catchy headline and relevant hashtags"
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
    description: "A concise post with essential information only (around 50-100 words)"
  },
  {
    value: "medium",
    label: "Medium",
    description: "A balanced post with moderate detail (around 100-200 words)"
  },
  {
    value: "long",
    label: "Long",
    description: "A comprehensive post with extensive detail (200+ words)"
  }
]

export function SocialGenerator() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("default")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")

  const generateSocialPost = async (e: React.FormEvent) => {
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
          templateType: "social",
          templateName,
          tone,
          length
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate social media post")
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error generating social media post:", error)
      setResult("Sorry, there was an error generating your social media post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={generateSocialPost} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="template">Template Style</Label>
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
            <Label htmlFor="length">Content Length</Label>
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
            Describe the social media post you'd like to generate:
          </Label>
          <Textarea
            id="prompt"
            placeholder="e.g., A product announcement for our new line of eco-friendly yoga mats"
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
            "Generate Social Media Post"
          )}
        </Button>
      </form>

      {result && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">
              {templateName === "instagram" ? "Instagram Post" : "Social Media Post"}
            </h2>
            <div className="whitespace-pre-wrap">{result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
