import fs from 'fs'
import path from 'path'
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ResourceItem {
  title: string
  author: string
  description: string
  link: string
  tags: string[]
}

interface ResourceCategory {
  name: string
  items: ResourceItem[]
}

interface ResourceData {
  categories: ResourceCategory[]
}

async function getResources(): Promise<ResourceData> {
  const filePath = path.join(process.cwd(), 'data', 'resources.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export default async function ResourcesPage() {
  const { categories } = await getResources()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Practice Resources</h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          A curated collection of books, courses, and tools to support your yoga practice and teaching journey.
        </p>

        {categories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
            <div className="grid gap-6">
              {category.items.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700"
                          >
                            {item.title}
                          </a>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-2">By {item.author}</p>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}