'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Component that uses searchParams
function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [redirectPath, setRedirectPath] = useState('/gamma')
  // No longer using router as we're using window.location for all redirects
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the redirect path from the URL query parameter
    const redirect = searchParams.get('redirect')
    if (redirect) {
      console.log('Redirect path from query parameter:', redirect)
      setRedirectPath(redirect)
    } else {
      console.log('No redirect path in query parameters, using default:', redirectPath)
    }
  }, [searchParams, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password === 'rs1156') {
      try {
        // Set authentication cookie with explicit domain and secure attributes
        // Use the current domain for the cookie to work with custom domains
        const domain = window.location.hostname;
        document.cookie = `gamma_auth=true; path=/; domain=${domain}; max-age=86400; SameSite=Strict` // 24 hours

        // Also store in localStorage as a backup
        localStorage.setItem('gamma_auth', 'true')

        // Log the redirection attempt
        console.log('Authentication successful, redirecting to:', redirectPath)

        // Add a small delay to ensure cookie is set before redirection
        setTimeout(() => {
          // Always use window.location for more reliable navigation with custom domains
          console.log('Using direct location navigation to:', redirectPath)

          // Ensure we have a full URL by prepending the current origin if needed
          const fullUrl = redirectPath.startsWith('http')
            ? redirectPath
            : `${window.location.origin}${redirectPath}`

          window.location.href = fullUrl
        }, 300)
      } catch (error) {
        console.error('Error during authentication or redirection:', error)
        setError('Authentication successful but redirection failed. Please try again.')
      }
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Protected Area</h1>
          <p className="mt-2 text-gray-600">Enter password to continue</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Protected Area</h1>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
