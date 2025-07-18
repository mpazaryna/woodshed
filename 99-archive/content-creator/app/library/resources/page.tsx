import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface LibraryItem {
  slug: string
  title: string
  description: string
  type: 'setlist' | 'talk'
  tags: string[]
  date: string
  content: string
}

async function getTalkItems(): Promise<LibraryItem[]> {
  const libraryPath = path.join(process.cwd(), 'data', 'library')
  
  // Check if directory exists
  if (!fs.existsSync(libraryPath)) {
    return []
  }
  
  const files = fs.readdirSync(libraryPath)
  
  const items = files.map((filename) => {
    const filePath = path.join(libraryPath, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      description: data.description,
      type: data.type,
      tags: data.tags || [],
      date: data.date,
      content: content
    }
  }).filter(item => item.type === 'resource')

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default async function TalksLibraryPage() {
  const items = await getTalkItems()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Resource Library</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Browse the library of uploaded resources.
        </p>

        <div className="flex justify-between items-center mb-8">
          <Link href="/library" className="text-teal-600 hover:text-teal-700">
            ← Back to Library
          </Link>
          <Link href="/nyi" className="text-teal-600 hover:text-teal-700">
            Upload New Resource →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg mb-4">No talks found in the library.</p>
            <Link href="/talks" className="text-teal-600 hover:text-teal-700">
              Create your first resource
            </Link>
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
                          href={`/library/${item.slug}`}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          {item.title}
                        </a>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
