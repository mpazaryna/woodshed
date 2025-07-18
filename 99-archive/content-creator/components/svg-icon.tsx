"use client"

import React from "react"
import { cn } from "@/lib/utils"

// Define the available SVG types
export type SVGType = "construction" | "coming-soon" | "maintenance" | "custom"

// Props for the SVGIcon component
export interface SVGIconProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: SVGType
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  secondaryColor?: string
  customSVG?: React.ReactNode
}

const SVGIcon = React.forwardRef<HTMLDivElement, SVGIconProps>(
  ({ 
    className, 
    type = "construction", 
    size = "lg", 
    color = "currentColor", 
    secondaryColor = "#6b7280", 
    customSVG,
    ...props 
  }, ref) => {
    // Size mapping
    const sizeMap = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-48 h-48",
    }

    // SVG content based on type
    const getSVGContent = () => {
      if (customSVG) {
        return customSVG
      }

      switch (type) {
        case "construction":
          return (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={color}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 12h.01" />
              <path d="M2 10h20" />
              <path d="M2 14h20" />
            </svg>
          )
        case "coming-soon":
          return (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={color}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )
        case "maintenance":
          return (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={color}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          )
        default:
          return (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={color}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 12h.01" />
            </svg>
          )
      }
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
        {getSVGContent()}
      </div>
    )
  }
)

SVGIcon.displayName = "SVGIcon"

export { SVGIcon }
