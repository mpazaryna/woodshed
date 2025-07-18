"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function TalkGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")

  // Form fields
  const [focus, setFocus] = useState("")
  const [style, setStyle] = useState("")
  const [duration, setDuration] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [scriptureReference, setScriptureReference] = useState("")
  const [concept, setConcept] = useState("")

  const generateTalk = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!focus.trim() || !style.trim() || !duration.trim() || !targetAudience.trim() || !concept.trim()) {
      return
    }

    setIsLoading(true)
    setResult("")

    try {
      console.log('Submitting dharma talk request with:', {
        focus, style, duration, targetAudience, scriptureReference, concept
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          templateType: "dharma",
          templateName: "default",
          focus,
          style,
          duration,
          targetAudience,
          scriptureReference,
          concept
        }),
      })

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate dharma talk: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.result) {
        console.log('Setting result, length:', data.result.length)
        setResult(data.result)
      } else {
        console.error('No result in response data:', data)
        setResult('Error: No result returned from the API')
      }
    } catch (error) {
      console.error("Error generating dharma talk:", error)
      setResult("Sorry, there was an error generating your dharma talk. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={generateTalk} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="focus">Focus</Label>
            <Input
              id="focus"
              placeholder="e.g., Mindfulness, Compassion, Impermanence"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              placeholder="e.g., Zen, Theravada, Secular"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 20 minutes, 45 minutes"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Beginners, Experienced practitioners"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="scriptureReference">Scripture Reference (Optional)</Label>
            <Input
              id="scriptureReference"
              placeholder="e.g., Heart Sutra, Dhammapada verse 5"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="concept">Concept/Theme</Label>
          <Textarea
            id="concept"
            placeholder="Describe the main concept or theme of the talk..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="min-h-[120px]"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={isLoading || !focus.trim() || !style.trim() || !duration.trim() || !targetAudience.trim() || !concept.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Talk"
          )}
        </Button>
      </form>

      {/* Debug result */}
      <div className="p-2 my-2 bg-gray-100 text-xs">
        Result exists: {result ? 'Yes' : 'No'},
        Length: {result ? result.length : 0}
        {result && (
          <div className="mt-2 p-2 border border-gray-300 whitespace-pre-wrap">
            <strong>Raw result:</strong><br />
            {result}
          </div>
        )}
      </div>

      {result && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Talk</h2>
            <div className="whitespace-pre-wrap">{result}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
