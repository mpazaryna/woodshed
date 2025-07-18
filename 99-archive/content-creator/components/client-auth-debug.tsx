'use client'

import { useEffect, useState } from 'react'
import { AuthDebug } from './auth-debug'

export function ClientAuthDebug() {
  const [isMounted, setIsMounted] = useState(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if we're in development mode
    setIsDev(process.env.NODE_ENV !== 'production')
  }, [])

  if (!isMounted || !isDev) {
    return null
  }

  return <AuthDebug />
}
