import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { ClientAuthDebug } from "@/components/client-auth-debug"
import Link from "next/link"
import { Logo } from "@/components/logo"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Content Creator",
  description: "Content Creation",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto">
                <Link href="/" className="flex items-center justify-center sm:justify-start">
                  <Logo size="sm" className="text-teal-600" />
                </Link>
              </div>
              <div className="flex space-x-4 sm:space-x-6">
                <Link href="/tools" className="hover:text-teal-600 text-sm sm:text-base">
                  Tools
                </Link>
                <Link href="/library" className="hover:text-teal-600 text-sm sm:text-base">
                  Library
                </Link>
                <Link href="/about" className="hover:text-teal-600 text-sm sm:text-base">
                  About
                </Link>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <Footer />
        {/* Add auth debug component */}
        <ClientAuthDebug />
      </body>
    </html>
  )
}
