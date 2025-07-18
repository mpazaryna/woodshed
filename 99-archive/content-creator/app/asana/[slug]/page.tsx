import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Badge } from "@/components/ui/badge"
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'

interface AsanaItemProps {
  params: {
    slug: string
  }
}

async function getAsanaItem(slug: string) {
  const filePath = path.join(process.cwd(), 'data', 'asana', `${slug}.md`)
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      sanskrit_name: data.sanskrit_name || '',
      transliteration: data.transliteration || '',
      english_translation: data.english_translation || '',
      canonical_text_reference: data.canonical_text_reference,
      earliest_known_reference: data.earliest_known_reference,
      content: content
    }
  } catch (error) {
    return null
  }
}

export default async function AsanaItemPage({ params }: AsanaItemProps) {
  const item = await getAsanaItem(params.slug)
  
  if (!item) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{item.english_translation}</h1>
          <div className="text-lg text-gray-600 mb-4">
            <p className="mb-2">{item.sanskrit_name}</p>
            <p>{item.transliteration}</p>
          </div>
          <div className="flex gap-2 items-center">
            {item.canonical_text_reference && (
              <Badge variant="secondary">
                {item.canonical_text_reference}
              </Badge>
            )}
            {item.earliest_known_reference && (
              <Badge variant="outline">
                {item.earliest_known_reference}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="prose max-w-none">
          <Markdown content={item.content} />
        </div>
      </div>
    </main>
  )
}
