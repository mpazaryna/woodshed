"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { FileContent } from "@/lib/file-reader"
import { Markdown } from "@/components/markdown"

interface ContentPreviewProps {
  fileSlug: string
  maxLength?: number
}

export function ContentPreview({ fileSlug, maxLength = 300 }: ContentPreviewProps) {
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!fileSlug) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/files/${fileSlug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch file content")
        }

        const data = await response.json()
        setFileContent(data.file)
      } catch (error) {
        console.error("Error fetching file content:", error)
        setError("Failed to load file content. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFileContent()
  }, [fileSlug])

  // Truncate content if it's too long
  const truncatedContent = fileContent?.content && fileContent.content.length > maxLength
    ? fileContent.content.substring(0, maxLength) + "..."
    : fileContent?.content

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Content Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : fileContent ? (
          <div className="prose prose-sm max-w-none">
            <h3 className="text-base font-medium">{fileContent.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{fileContent.description}</p>
            <div className="text-sm border-t pt-2 mt-2">
              <Markdown content={truncatedContent || ''} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a file to preview its content</p>
        )}
      </CardContent>
    </Card>
  )
}
