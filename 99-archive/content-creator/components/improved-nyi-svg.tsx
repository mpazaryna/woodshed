"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ImprovedNYISVGProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  title?: string
  subtitle?: string
  ragText?: string
}

export const ImprovedNYISVG = React.forwardRef<HTMLDivElement, ImprovedNYISVGProps>(
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
          <rect x="0" y="0" width="800" height="500" fill="#f8fafc" rx="12" ry="12" />
          
          {/* Gradient background for visual interest */}
          <defs>
            <radialGradient id="hexGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="#e6f7f5" />
              <stop offset="100%" stopColor="#f8fafc" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="800" height="500" fill="url(#hexGradient)" rx="12" ry="12" />
          
          {/* Hexagon Icon */}
          <g transform="translate(400, 150)">
            {/* Outer glow */}
            <circle cx="0" cy="0" r="80" fill="#e6f7f5" />
            
            {/* Hexagon layers */}
            <g>
              <path 
                d="M0,-50 L43.3,-25 L43.3,25 L0,50 L-43.3,25 L-43.3,-25 Z" 
                fill="#e6f7f5" 
                stroke="#00a99d" 
                strokeWidth="1.5"
                opacity="0.3" 
              />
              <path 
                d="M0,-40 L34.6,-20 L34.6,20 L0,40 L-34.6,20 L-34.6,-20 Z" 
                fill="#e6f7f5" 
                stroke="#00a99d" 
                strokeWidth="1.5"
                opacity="0.5" 
              />
              <path 
                d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" 
                fill="#00a99d" 
                opacity="0.7" 
              />
            </g>
          </g>
          
          {/* Main text */}
          <text 
            x="400" 
            y="270" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="28" 
            fontWeight="600" 
            textAnchor="middle" 
            fill="#334155"
          >
            {title}
          </text>
          
          {/* Subtitle text */}
          <text 
            x="400" 
            y="310" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="16" 
            textAnchor="middle" 
            fill="#64748b"
          >
            {subtitle}
          </text>
          
          {/* Design elements - dots */}
          <g>
            <circle cx="320" cy="400" r="4" fill="#00a99d" />
            <circle cx="335" cy="400" r="4" fill="#00a99d" opacity="0.7" />
            <circle cx="350" cy="400" r="4" fill="#00a99d" opacity="0.4" />
            
            <circle cx="450" cy="400" r="4" fill="#00a99d" opacity="0.4" />
            <circle cx="465" cy="400" r="4" fill="#00a99d" opacity="0.7" />
            <circle cx="480" cy="400" r="4" fill="#00a99d" />
          </g>
          
          {/* RAG mention with teal underline */}
          <g transform="translate(400, 350)">
            <text 
              x="0" 
              y="0" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="14" 
              fontStyle="italic" 
              textAnchor="middle" 
              fill="#64748b"
            >
              {ragText}
            </text>
            <line 
              x1="-140" 
              y1="5" 
              x2="140" 
              y2="5" 
              stroke="#00a99d" 
              strokeWidth="1" 
              strokeDasharray="1 2" 
              opacity="0.8" 
            />
          </g>
        </svg>
      </div>
    )
  }
)

ImprovedNYISVG.displayName = "ImprovedNYISVG"
