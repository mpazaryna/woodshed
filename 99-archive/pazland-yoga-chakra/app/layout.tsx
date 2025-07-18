"use client"
import { ChakraProvider } from "@chakra-ui/react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BubbleChat } from "flowise-embed-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <ChakraProvider>
          <div>
            <Navbar />
            {children}
            <Footer />
            <BubbleChat chatflowid="2613824f-1a1b-420c-9bab-77d46fbc6106" apiHost="https://flowise-g57j.onrender.com" />
          </div>
        </ChakraProvider>
        
      </body>
    </html>
  )
}
