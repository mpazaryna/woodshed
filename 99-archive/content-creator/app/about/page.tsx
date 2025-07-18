export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Content Creator</h1>

        <div className="prose max-w-none">
          <p className="mb-4">
            Content Creator is an advanced AI-powered platform designed for marketing and sales teams.
            Built with Retrieval-Augmented Generation (RAG) technology, our solution transforms your existing
            product documentation and marketing materials into compelling, on-brand content across multiple formats.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
          <p className="mb-4">
            Our mission is to streamline the content creation process for marketing teams, enabling them to
            produce high-quality, consistent messaging at scale while maintaining brand voice and accuracy.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Key Features</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Social Media Generator:</strong> Create social media posts
              from your existing product documentation with customizable tone, length, and audience settings.
            </li>
            <li className="mb-2">
              <strong>Video Script Generator:</strong> Develop compelling video scripts for product explainers,
              feature launches, and promotional content with adjustable duration and style options.
            </li>
            <li className="mb-2">
              <strong>Long Form Generator:</strong> Create blog articles, case studies, and more
              from your existing product documentation with customizable tone, length, and audience settings.
            </li>
            
            <li className="mb-2">
              <strong>Document-Driven Approach:</strong> Upload your existing materials (PDFs, docs, presentations)
              and let our AI extract the most relevant information for accurate content generation.
            </li>
            <li className="mb-2">
              <strong>Customizable Outputs:</strong> Adjust tone of voice, content length, target audience, and
              other parameters to perfectly match your brand requirements.
            </li>
            <li className="mb-2">
              <strong>Content Library:</strong> Save and organize your generated content for easy access and reuse.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">Use Cases</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Product marketing teams creating consistent messaging across channels</li>
            <li className="mb-2">Content marketers scaling production of blog posts and social content</li>
            <li className="mb-2">Sales enablement teams developing customer-facing materials</li>
            <li className="mb-2">Video production teams streamlining script creation</li>
            <li className="mb-2">Marketing agencies managing multiple client content needs</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
