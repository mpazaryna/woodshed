import Link from "next/link"
import { Heart } from "lucide-react"
import { Logo } from "./logo"

export function Footer() {
  return (
    <footer className="border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} All rights reserved.</p>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/tools" className="text-sm text-gray-600 hover:text-teal-600">
              Tools
            </Link>
            <Link href="/library" className="text-sm text-gray-600 hover:text-teal-600">
              Library
            </Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-teal-600">
              About
            </Link>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex flex-col items-center p-2">
              <Logo size="sm" className="text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
