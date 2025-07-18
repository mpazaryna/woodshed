import { VideoRagGenerator } from "@/components/video-rag-generator"
import Link from 'next/link'

export default function VideosRagPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mb-6">
          <Link href="/tools" className="text-teal-600 hover:text-teal-700">
            ← Back to Tools
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">Document-Based Video Script Creator</h1>
        <p className="text-lg text-center mb-8 max-w-2xl">
          Create video scripts directly from your existing product documentation with customizable tone, length, and format options.
        </p>
        <VideoRagGenerator />
      </div>
    </main>
  )
}
