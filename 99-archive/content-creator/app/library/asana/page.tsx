import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface AsanaItem {
  slug: string
  sanskrit_name: string
  transliteration: string
  english_translation: string
  canonical_text_reference?: string
  earliest_known_reference?: string
  content: string
}

async function getAsanaItems(): Promise<AsanaItem[]> {
  const asanaPath = path.join(process.cwd(), 'data', 'asana')
  
  // Check if directory exists
  if (!fs.existsSync(asanaPath)) {
    return []
  }
  
  const files = fs.readdirSync(asanaPath)
  
  const items = files.map((filename) => {
    const filePath = path.join(asanaPath, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug: filename.replace('.md', ''),
      sanskrit_name: data.sanskrit_name || '',
      transliteration: data.transliteration || '',
      english_translation: data.english_translation || '',
      canonical_text_reference: data.canonical_text_reference,
      earliest_known_reference: data.earliest_known_reference,
      content: content
    }
  })

  return items.sort((a, b) => a.transliteration.localeCompare(b.transliteration))
}

export default async function AsanaLibraryPage() {
  const items = await getAsanaItems()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Asana Library</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          A collection of yoga asanas with their Sanskrit names, translations, and practice instructions.
        </p>

        <div className="flex justify-between items-center mb-8">
          <Link href="/library" className="text-teal-600 hover:text-teal-700">
            ← Back to Library
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg mb-4">No asanas found in the library.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <Card key={item.slug}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        <a 
                          href={`/asana/${item.slug}`}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          {item.english_translation}
                        </a>
                      </CardTitle>
                      <CardDescription>
                        <span className="block">{item.sanskrit_name}</span>
                        <span className="block">{item.transliteration}</span>
                      </CardDescription>
                    </div>
                    {item.canonical_text_reference && (
                      <Badge variant="secondary">
                        {item.canonical_text_reference}
                      </Badge>
                    )}
                  </div>
                  {item.earliest_known_reference && (
                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline">
                        {item.earliest_known_reference}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
