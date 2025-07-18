"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileMetadata } from "@/lib/file-reader"

interface FileSelectorProps {
  onFileSelect: (fileSlug: string) => void
  fileType?: string
  label?: string
  description?: string
}

export function FileSelector({ 
  onFileSelect, 
  fileType = 'resource',
  label = 'Select Source File',
  description = 'Choose a file to use as the source for generation'
}: FileSelectorProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/files?type=${fileType}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }
        
        const data = await response.json()
        setFiles(data.files)
        
        // Select the first file by default if available
        if (data.files.length > 0) {
          setSelectedFile(data.files[0].slug)
          onFileSelect(data.files[0].slug)
        }
      } catch (error) {
        console.error("Error fetching files:", error)
        setError("Failed to load files. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFiles()
  }, [fileType, onFileSelect])

  const handleFileChange = (value: string) => {
    setSelectedFile(value)
    onFileSelect(value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file-selector">{label}</Label>
      <Select
        value={selectedFile}
        onValueChange={handleFileChange}
        disabled={isLoading || files.length === 0}
      >
        <SelectTrigger id="file-selector">
          <SelectValue placeholder={isLoading ? "Loading files..." : "Select a file"} />
        </SelectTrigger>
        <SelectContent>
          {files.map((file) => (
            <SelectItem key={file.slug} value={file.slug}>
              {file.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {selectedFile 
            ? files.find(f => f.slug === selectedFile)?.description 
            : description}
        </p>
      )}
    </div>
  )
}
