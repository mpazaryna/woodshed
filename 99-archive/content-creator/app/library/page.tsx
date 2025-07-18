import Link from 'next/link'

export default function LibraryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Library</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link href="/library/socials" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Social Media Generations</h2>
            <p className="text-gray-700">
              Browse a collection of generated social media posts, each crafted with a unique tone and audience focus.
            </p>
          </Link>
          <Link href="/library/videos" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Video Script Generations</h2>
            <p className="text-gray-700">
             Browse a collection of generated video scripts, each designed to captivate your audience with engaging content.
            </p>
          </Link>
          <Link href="/library/longform" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Long Form Generations</h2>
            <p className="text-gray-700">
              Browse a collection of generated long-form content, each meticulously crafted to provide in-depth insights and value.
            </p>
          </Link>
          <Link href="/library/resources" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">RAG Documents</h2>
            <p className="text-gray-700">
              Explore and manage your collection of documents used for Retrieval-Augmented Generation (RAG).
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}