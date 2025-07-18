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
    label: "Standard Yoga Setlist",
    description: "A balanced yoga sequence with warm-up, main sequence, and cool down"
  },
  {
    value: "restorative",
    label: "Restorative Yoga",
    description: "Gentle, nurturing sequence focused on relaxation and stress relief"
  }
]

export function SetlistGenerator() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("default")

  const generateSetlist = async (e: React.FormEvent) => {
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
          templateType: "yoga",
          templateName
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate setlist")
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error generating setlist:", error)
      setResult("Sorry, there was an error generating your setlist. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={generateSetlist} className="space-y-4">
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
        </div>

        <div>
          <Label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Describe the yoga setlist you'd like to generate:
          </Label>
          <Textarea
            id="prompt"
            placeholder="e.g., A 30-minute gentle flow for beginners focusing on hip opening and relaxation"
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
            "Generate Yoga Setlist"
          )}
        </Button>
      </form>

      {result && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Yoga Setlist</h2>
            <div className="whitespace-pre-wrap">{result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
