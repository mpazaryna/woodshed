import Link from 'next/link'

export default function PropsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Yoga Props</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Just as physical props support and enhance your yoga practice, these digital props help you create and structure your teaching materials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link href="/setlists" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Setlist Creator</h2>
            <p className="text-gray-700">
              Create structured yoga sequences with precise pose selection, timing, and transitions for teaching or personal practice.
            </p>
          </Link>
          <Link href="/talks" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Talk Creator</h2>
            <p className="text-gray-700">
              Develop thoughtful talks with organized teaching points, examples, and practice guidance.
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg mb-4">Looking for saved content?</p>
          <Link href="/library" className="text-teal-600 hover:text-teal-700 font-medium">
            Visit the Library →
          </Link>
        </div>
      </div>
    </main>
  )
}
