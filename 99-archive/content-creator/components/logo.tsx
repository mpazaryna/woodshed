"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = "md", ...props }, ref) => {
    // Size mapping - ensure visibility on mobile
    const sizeMap = {
      sm: "w-full max-w-xs h-10 sm:h-16", // Responsive width with max width
      md: "w-full max-w-sm h-14 sm:h-20",
      lg: "w-full max-w-md h-16 sm:h-24",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          sizeMap[size],
          className
        )}
        {...props}
      >
        <svg viewBox="0 0 310 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" role="img" aria-label="Content Creator Logo">
          {/* Stacked documents with cleaner design */}
          <rect x="20" y="35" width="40" height="45" rx="3" fill="#ffffff" stroke="currentColor" strokeWidth="2"/>
          <rect x="25" y="30" width="40" height="45" rx="3" fill="#ffffff" stroke="currentColor" strokeWidth="2"/>
          <rect x="30" y="25" width="40" height="45" rx="3" fill="#ffffff" stroke="currentColor" strokeWidth="2"/>

          {/* Text lines on top document */}
          <line x1="40" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="40" y1="45" x2="52" y2="45" stroke="currentColor" strokeWidth="1.5"/>

          {/* Cleaner transformation element */}
          <circle cx="70" cy="50" r="12" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>

          {/* Simplified arrow paths */}
          {/* Input arrow */}
          <path d="M55,50 L65,50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M60,50 L65,50 L62,47" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M60,50 L65,50 L62,53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

          {/* Output transformed content */}
          <path d="M75,50 L85,50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M80,50 L85,50 L82,47" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M80,50 L85,50 L82,53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

          {/* Processing indicators inside transformation circle */}
          <path d="M65,45 C65,45 70,45 70,50 C70,55 75,55 75,55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M75,45 C75,45 70,45 70,50 C70,55 65,55 65,55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

          {/* Content Creator text */}
          {/* Add extra padding between logo and text */}
          <text x="205" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" textAnchor="middle" fill="currentColor" dominantBaseline="middle">Content Creator</text>
        </svg>
      </div>
    )
  }
)

Logo.displayName = "Logo"
