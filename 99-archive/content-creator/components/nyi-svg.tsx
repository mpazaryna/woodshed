"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface NYISVGProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  title?: string
  subtitle?: string
  ragText?: string
}

export const NYISVG = React.forwardRef<HTMLDivElement, NYISVGProps>(
  ({
    className,
    width = 800,
    height = 500,
    title = "This Feature is Coming Soon",
    subtitle = "We're working on adding this functionality to Content Creator.",
    ragText = "Part of our Retrieval-Augmented Generation roadmap",
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <svg
          viewBox="0 0 800 500"
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid meet"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Background */}
          <rect x="0" y="0" width="800" height="500" fill="#ffffff" rx="8" ry="8" />

          {/* Subtle pattern background */}
          <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="8" ry="8" opacity="0.7" />

          {/* Content Creator logo/icon */}
          <g transform="translate(400, 150)">
            <circle cx="0" cy="0" r="70" fill="#f0f7f6" />
            <path d="M0,-40 L34.6,-20 L34.6,20 L0,40 L-34.6,20 L-34.6,-20 Z" fill="#00a99d" opacity="0.15" />
            <path d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" fill="#00a99d" opacity="0.4" />
            <path d="M0,-20 L17.3,-10 L17.3,10 L0,20 L-17.3,10 L-17.3,-10 Z" fill="#00a99d" opacity="0.8" />
          </g>

          {/* Main text */}
          <text x="400" y="270" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="600" textAnchor="middle" fill="#333333">
            {title}
          </text>

          {/* Subtitle text */}
          <text x="400" y="310" fontFamily="Arial, sans-serif" fontSize="16" textAnchor="middle" fill="#666666">
            {subtitle}
          </text>

          {/* Design elements - dots */}
          <g opacity="0.8">
            <circle cx="200" cy="400" r="4" fill="#00a99d" />
            <circle cx="215" cy="400" r="4" fill="#00a99d" opacity="0.7" />
            <circle cx="230" cy="400" r="4" fill="#00a99d" opacity="0.4" />

            <circle cx="570" cy="400" r="4" fill="#00a99d" opacity="0.4" />
            <circle cx="585" cy="400" r="4" fill="#00a99d" opacity="0.7" />
            <circle cx="600" cy="400" r="4" fill="#00a99d" />
          </g>

          {/* RAG mention with teal underline */}
          <g transform="translate(400, 350)">
            <text x="0" y="0" fontFamily="Arial, sans-serif" fontSize="14" fontStyle="italic" textAnchor="middle" fill="#555555">
              {ragText}
            </text>
            <line x1="-140" y1="5" x2="140" y2="5" stroke="#00a99d" strokeWidth="1.5" strokeDasharray="1 2" opacity="0.8" />
          </g>
        </svg>
      </div>
    )
  }
)

NYISVG.displayName = "NYISVG"
