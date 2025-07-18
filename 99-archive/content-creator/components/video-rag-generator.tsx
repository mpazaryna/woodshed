"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSelector } from "@/components/file-selector"
import { ContentPreview } from "@/components/content-preview"
import { FileContent } from "@/lib/file-reader"
import { Markdown } from "@/components/markdown"

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

export function VideoRagGenerator() {
  const [selectedFileSlug, setSelectedFileSlug] = useState<string>("")
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [result, setResult] = useState("")
  const resultRef = useRef<string>("") // Use a ref to store the result
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("default")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [error, setError] = useState<string | null>(null)

  // Fetch file content when selected file changes
  useEffect(() => {
    const fetchFileContent = async () => {
      if (!selectedFileSlug) return

      try {
        const response = await fetch(`/api/files/${selectedFileSlug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch file content")
        }

        const data = await response.json()
        setFileContent(data.file)
      } catch (error) {
        console.error("Error fetching file content:", error)
        setError("Failed to load file content. Please try again.")
      }
    }

    fetchFileContent()
  }, [selectedFileSlug])

  // Debug effect to log when result changes
  useEffect(() => {
    console.log('[VideoRagGenerator] Result changed:', result ? result.length : 0)
    if (result) {
      console.log('[VideoRagGenerator] Result preview:', result.substring(0, 50))
    }
  }, [result])

  const handleFileSelect = (fileSlug: string) => {
    setSelectedFileSlug(fileSlug)
    setResult("") // Clear previous results when file changes
  }

  const generateVideoScript = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFileSlug) {
      setError("Please select a file first")
      return
    }

    setIsLoading(true)
    setResult("") // Clear previous result
    setError(null)

    try {
      console.log('[VideoRagGenerator] Starting generation with file:', selectedFileSlug)

      const response = await fetch("/api/generate-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileSlug: selectedFileSlug,
          templateType: "video-rag",
          templateName,
          tone,
          length
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video script")
      }

      const data = await response.json()
      console.log('[VideoRagGenerator] Response data received:', data)
      console.log('[VideoRagGenerator] Result content length:', data.result ? data.result.length : 0)

      // Store the result in a local variable first
      const generatedResult = data.result || ''
      console.log('[VideoRagGenerator] Setting result, length:', generatedResult.length)

      // Store the result in the ref
      resultRef.current = generatedResult
      console.log('[VideoRagGenerator] Result stored in ref, length:', resultRef.current.length)

      // Set the result state to trigger a re-render
      setResult(generatedResult)

      // Force a re-render after a short delay
      setTimeout(() => {
        console.log('[VideoRagGenerator] Forcing re-render with result length:', resultRef.current.length)
        setResult(resultRef.current) // Set it again to ensure the component re-renders
      }, 100)
    } catch (error) {
      console.error("Error generating video script:", error)
      setError("Sorry, there was an error generating your video script. Please try again.")
    } finally {
      setIsLoading(false)
      console.log('[VideoRagGenerator] Generation completed, isLoading set to false')
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={generateVideoScript} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FileSelector
            onFileSelect={handleFileSelect}
            fileType="resource"
            label="Select Source Document"
            description="Choose a product document to use as the source for your video script"
          />
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
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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

        {selectedFileSlug && (
          <ContentPreview fileSlug={selectedFileSlug} maxLength={300} />
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={isLoading || !selectedFileSlug}
        >
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

      {/* Debug info */}
      <div className="mt-4 p-2 text-xs bg-gray-100 rounded">
        <p>Selected File: {selectedFileSlug || 'None'}</p>
        <p>File Content: {fileContent ? 'Loaded' : 'Not loaded'}</p>
        <p>Result State: {result ? `${result.substring(0, 20)}...` : 'None'}</p>
        <p>Result Ref: {resultRef.current ? `${resultRef.current.substring(0, 20)}...` : 'None'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Result State Length: {result ? result.length : 0}</p>
        <p>Result Ref Length: {resultRef.current ? resultRef.current.length : 0}</p>
        {resultRef.current && resultRef.current.length > 0 && !result && (
          <button
            onClick={() => setResult(resultRef.current)}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Force Display Result
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card className="mt-8">
          <CardContent className="pt-6 flex items-center justify-center p-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
              <p className="text-muted-foreground">Generating video script...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result display - only show when not loading and result exists */}
      {!isLoading && (result || resultRef.current) && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">
              {templateName === "tiktok" ? "TikTok Script" :
               templateName === "youtube" ? "YouTube Script" : "Video Script"}
            </h2>
            <div className="mb-4">
              {/* Direct rendering of content */}
              <div className="whitespace-pre-wrap p-4 border rounded">
                {result || resultRef.current}
              </div>
            </div>
            <div className="mt-4 p-2 bg-gray-50 border rounded text-xs">
              <details>
                <summary className="cursor-pointer">Raw Result</summary>
                <pre className="mt-2 whitespace-pre-wrap">{result || resultRef.current}</pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
