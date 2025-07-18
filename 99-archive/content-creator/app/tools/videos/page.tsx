import { VideoGenerator } from "@/components/video-generator"
import Link from 'next/link'

export default function ThemesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mb-6">
          <Link href="/tools" className="text-teal-600 hover:text-teal-700">
            ← Back to Tools
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">Video Scripts Creator</h1>
        <p className="text-lg text-center mb-8 max-w-2xl">
          Develop video scripts for product explainers, feature launches, and promotional content with adjustable duration and style options.
        </p>
        <VideoGenerator />
      </div>
    </main>
  )
}