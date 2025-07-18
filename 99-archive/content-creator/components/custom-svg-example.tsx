"use client"

import React from "react"
import { SVGIcon } from "./svg-icon"

export function CustomSVGExample() {
  // Example of using a custom SVG with the SVGIcon component
  const customSVG = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )

  return (
    <div className="p-4 border rounded-lg">
      <SVGIcon customSVG={customSVG} size="md" />
      <h3 className="text-lg font-medium mt-4">Custom SVG</h3>
      <p className="text-sm text-gray-600">
        This demonstrates how to use a custom SVG with the SVGIcon component.
      </p>
    </div>
  )
}
