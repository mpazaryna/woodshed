import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  console.log('[Markdown] Rendering content, length:', content?.length || 0);
  console.log('[Markdown] Content preview:', content?.substring(0, 50));

  if (!content) {
    console.log('[Markdown] No content to render');
    return <div className="text-gray-500 italic">No content to display</div>;
  }

  // Simple fallback if ReactMarkdown fails
  try {
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mt-8 mb-4">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="mb-2">
              <div className="space-y-1">{children}</div>
            </li>
          ),
          hr: () => (
            <hr className="my-8 border-gray-200" />
          ),
          // Handle definition lists for Duration, Breathing, Transition
          dl: ({ children }) => (
            <dl className="space-y-2 mb-4">{children}</dl>
          ),
          dt: ({ children }) => (
            <dt className="font-semibold text-gray-900">{children}</dt>
          ),
          dd: ({ children }) => (
            <dd className="text-gray-700 ml-4">{children}</dd>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    )
  } catch (error) {
    console.error('[Markdown] Error rendering markdown:', error);
    // Simple fallback rendering
    return (
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    );
  }
}
