"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "icon-only"
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8", 
    lg: "h-12"
  }

  const iconSize = {
    sm: 24,
    md: 32,
    lg: 48
  }

  if (variant === "icon-only") {
    return (
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 200 200"
        className={cn("", className)}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle - adapts to theme */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
        />
        
        {/* Left person */}
        <g fill="currentColor">
          {/* Head */}
          <circle cx="70" cy="60" r="16" />
          {/* Body */}
          <path d="M40 90 Q40 80 50 80 L90 80 Q100 80 100 90 L100 130 Q100 140 90 140 L50 140 Q40 140 40 130 Z" />
        </g>
        
        {/* Right person */}
        <g fill="currentColor">
          {/* Head */}
          <circle cx="130" cy="60" r="16" />
          {/* Body */}
          <path d="M100 90 Q100 80 110 80 L150 80 Q160 80 160 90 L160 130 Q160 140 150 140 L110 140 Q100 140 100 130 Z" />
        </g>
        
        {/* Handshake connection */}
        <path
          d="M90 100 Q100 90 110 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 200 200"
        className=""
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle - adapts to theme */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
        />
        
        {/* Left person */}
        <g fill="currentColor">
          {/* Head */}
          <circle cx="70" cy="60" r="16" />
          {/* Body */}
          <path d="M40 90 Q40 80 50 80 L90 80 Q100 80 100 90 L100 130 Q100 140 90 140 L50 140 Q40 140 40 130 Z" />
        </g>
        
        {/* Right person */}
        <g fill="currentColor">
          {/* Head */}
          <circle cx="130" cy="60" r="16" />
          {/* Body */}
          <path d="M100 90 Q100 80 110 80 L150 80 Q160 80 160 90 L160 130 Q160 140 150 140 L110 140 Q100 140 100 130 Z" />
        </g>
        
        {/* Handshake connection */}
        <path
          d="M90 100 Q100 90 110 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      
      <span className={cn(
        "font-bold tracking-tight",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl"
      )}>
        AidChain
      </span>
    </div>
  )
}