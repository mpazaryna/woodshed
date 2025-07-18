'use client'

import { useState, useEffect } from 'react'

export function AuthDebug() {
  const [authState, setAuthState] = useState<{
    cookie: boolean;
    localStorage: boolean;
    cookieValue: string;
    localStorageValue: string;
  }>({
    cookie: false,
    localStorage: false,
    cookieValue: '',
    localStorageValue: '',
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check cookie
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('gamma_auth='))
    const cookieValue = hasCookie 
      ? document.cookie.split(';').find(c => c.trim().startsWith('gamma_auth='))?.trim() || ''
      : ''
    
    // Check localStorage
    const localStorageValue = localStorage.getItem('gamma_auth') || ''
    const hasLocalStorage = !!localStorageValue
    
    setAuthState({
      cookie: hasCookie,
      localStorage: hasLocalStorage,
      cookieValue,
      localStorageValue,
    })
  }, [])

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-200 text-gray-700 p-2 rounded-md text-xs"
      >
        Debug Auth
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-md shadow-md text-xs max-w-xs">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Auth Debug</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500">×</button>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Cookie:</span> {authState.cookie ? '✅' : '❌'}
          {authState.cookieValue && (
            <div className="text-gray-500 truncate">{authState.cookieValue}</div>
          )}
        </div>
        
        <div>
          <span className="font-semibold">LocalStorage:</span> {authState.localStorage ? '✅' : '❌'}
          {authState.localStorageValue && (
            <div className="text-gray-500 truncate">{authState.localStorageValue}</div>
          )}
        </div>
        
        <div>
          <span className="font-semibold">Domain:</span> {window.location.hostname}
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <button 
            onClick={() => {
              // Clear auth data
              document.cookie = 'gamma_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              localStorage.removeItem('gamma_auth');
              
              // Refresh auth state
              const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('gamma_auth='))
              const cookieValue = hasCookie 
                ? document.cookie.split(';').find(c => c.trim().startsWith('gamma_auth='))?.trim() || ''
                : ''
              
              const localStorageValue = localStorage.getItem('gamma_auth') || ''
              const hasLocalStorage = !!localStorageValue
              
              setAuthState({
                cookie: hasCookie,
                localStorage: hasLocalStorage,
                cookieValue,
                localStorageValue,
              })
            }}
            className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs"
          >
            Clear Auth Data
          </button>
        </div>
      </div>
    </div>
  )
}
