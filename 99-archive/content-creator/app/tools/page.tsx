import Link from 'next/link'

export default function PropsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Tools</h1>

        <h2 className="text-2xl font-bold mb-4">Manual Input Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
          <Link href="/tools/socials" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Social Media Posts</h2>
            <p className="text-gray-700">
            The AI Content Creator is a module designed to generate marketing content from uploaded source
documents. It supports generation of social media content, blog posts, case studies, and
other formats, with adjustable filters and tone options.
            </p>
          </Link>
          <Link href="/tools/videos" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50">
            <h2 className="text-2xl font-bold mb-2 text-teal-600">Video Script Generator</h2>
            <p className="text-gray-700">
            The AI Video Script Generator is a module designed to assist sales, marketing, and
            product teams in creating compelling, on-brand video scripts for product explainers.
            </p>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">RAG Based Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link href="/tools/socials-rag" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 border-teal-200">
            <div className="flex items-center mb-2">
              <h2 className="text-2xl font-bold text-teal-600">RAG Social Posts</h2>
              <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded">New</span>
            </div>
            <p className="text-gray-700">
              Create social media posts directly from your existing product documentation with customizable tone, length, and style settings.
            </p>
          </Link>
          <Link href="/tools/videos-rag" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 border-teal-200">
            <div className="flex items-center mb-2">
              <h2 className="text-2xl font-bold text-teal-600">RAG Video Scripts</h2>
              <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded">New</span>
            </div>
            <p className="text-gray-700">
              Create video scripts directly from your existing product documentation with customizable tone, length, and format options.
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
