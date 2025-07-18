"use client"

import React from "react"

export function SimpleNYISVG() {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="600"
        height="375"
        viewBox="0 0 600 375"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="600" height="375" fill="#f0f7f6" rx="8" ry="8" />
        
        {/* Hexagon */}
        <g transform="translate(300, 120)">
          <path 
            d="M0,-40 L34.6,-20 L34.6,20 L0,40 L-34.6,20 L-34.6,-20 Z" 
            fill="#00a99d" 
            opacity="0.3" 
          />
          <path 
            d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" 
            fill="#00a99d" 
            opacity="0.6" 
          />
          <path 
            d="M0,-20 L17.3,-10 L17.3,10 L0,20 L-17.3,10 L-17.3,-10 Z" 
            fill="#00a99d" 
          />
        </g>
        
        {/* Text */}
        <text 
          x="300" 
          y="200" 
          fontFamily="Arial, sans-serif" 
          fontSize="24" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill="#333333"
        >
          This Feature is Coming Soon
        </text>
        
        <text 
          x="300" 
          y="230" 
          fontFamily="Arial, sans-serif" 
          fontSize="16" 
          textAnchor="middle" 
          fill="#666666"
        >
          We're working on adding this functionality to Content Creator.
        </text>
        
        
        {/* Dots */}
        <g>
          <circle cx="250" cy="320" r="4" fill="#00a99d" />
          <circle cx="270" cy="320" r="4" fill="#00a99d" opacity="0.7" />
          <circle cx="290" cy="320" r="4" fill="#00a99d" opacity="0.4" />
          
          <circle cx="310" cy="320" r="4" fill="#00a99d" opacity="0.4" />
          <circle cx="330" cy="320" r="4" fill="#00a99d" opacity="0.7" />
          <circle cx="350" cy="320" r="4" fill="#00a99d" />
        </g>
      </svg>
    </div>
  )
}
