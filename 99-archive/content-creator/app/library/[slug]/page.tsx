import { promises as fsPromises } from 'fs'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Badge } from "@/components/ui/badge"
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown' // You'll need to create this component

// Define the page props according to Next.js App Router conventions
type Params = {
  slug: string
}

type Props = {
  params: Params
}

async function getLibraryItem(slug: string) {
  const filePath = path.join(process.cwd(), 'data', 'library', `${slug}.md`)

  try {
    // Use promises for file operations to ensure proper async handling
    const fileContents = await fsPromises.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      type: data.type,
      tags: data.tags || [],
      date: data.date,
      content: content
    }
  } catch (error) {
    console.error(`Error loading library item ${slug}:`, error)
    return null
  }
}

export default async function LibraryItemPage(props: Props) {
  // In Next.js App Router, we need to await the params object
  const params = await Promise.resolve(props.params)
  const slug = params.slug

  // Now we can safely use the slug
  const item = await getLibraryItem(slug)

  if (!item) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{item.description}</p>
          <div className="flex gap-2 items-center">
            <Badge variant={item.type === 'setlist' ? 'default' : 'secondary'}>
              {item.type}
            </Badge>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="prose max-w-none">
          <Markdown content={item.content} />
        </div>
      </div>
    </main>
  )
}