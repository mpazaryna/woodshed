import { SetlistGenerator } from "@/components/setlist-generator"
import Link from 'next/link'

export default function SetlistsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mb-6">
          <Link href="/tools" className="text-teal-600 hover:text-teal-700">
            ← Back to Tools
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">Yoga Setlist Creator</h1>
        <p className="text-lg text-center mb-8 max-w-2xl">
          Create professional yoga sequences with precise instructions and timing. This tool is part of the broader
          Yoga Genome project, which aims to systematically map the relationships between different aspects of yoga practice.
        </p>
        <SetlistGenerator />
      </div>
    </main>
  )
}
