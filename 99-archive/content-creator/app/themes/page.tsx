import { TalkGenerator } from "@/components/talk-generator"

export default function ThemesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">Class Themes</h1>
        <p className="text-lg text-center mb-8 max-w-2xl">
          Develop thoughtful themes for your yoga classes with organized teaching points, examples, and practice guidance.
          This tool helps you create meaningful philosophical context that complements and enhances your physical sequences.
        </p>
        <TalkGenerator />
      </div>
    </main>
  )
}
