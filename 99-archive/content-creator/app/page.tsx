import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">Content Creator</h1>
        <p className="text-lg text-center mb-4 max-w-2xl">
          Transform your content into compelling marketing materials with our AI-powered platform. Using advanced Retrieval-Augmented Generation technology, Content Creator helps organizations produce high-quality, consistent messaging at scale while maintaining brand voice and accuracy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link href="/tools" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Tools</h2>
            <p className="text-gray-700">
              Access digital tools for generating content from Retrieval-Augmented Generation or manual input.
            </p>
          </Link>
          <Link href="/library" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Library</h2>
            <p className="text-gray-700">
              Access and manage a collection of content for Retrieval-Augmented Generation and access previously created content.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
