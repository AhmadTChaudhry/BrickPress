"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LegoBrickProps {
    color: string
    width?: number // in units of 20px (e.g. 4 = 80px)
    depth?: number // in units of 20px
    className?: string
}

export function LegoBrick({ color, width = 4, depth = 2, className }: LegoBrickProps) {
    const unitSize = 24
    const height = 18
    const studHeight = 4
    
    // Convert Tailwind color to hex for shadows (approximate mapping)
    // This is a simplified approach; in a real app we might map specific colors
    const getShadowColor = (baseColor: string) => {
        // Just darkening via filter in CSS usually works better for dynamic colors
        return "brightness(0.7)"
    }

    return (
        <div 
            className={cn("relative preserve-3d", className)}
            style={{ 
                width: width * unitSize, 
                height: depth * unitSize,
                transformStyle: "preserve-3d"
            }}
        >
            {/* Studs */}
            {Array.from({ length: width * depth }).map((_, i) => {
                const row = Math.floor(i / width)
                const col = i % width
                return (
                    <div
                        key={i}
                        className={cn("absolute rounded-full shadow-sm", color)}
                        style={{
                            width: unitSize * 0.6,
                            height: unitSize * 0.6,
                            left: col * unitSize + (unitSize * 0.2),
                            top: row * unitSize + (unitSize * 0.2),
                            transform: `translateZ(${height}px)`,
                            height: studHeight, // Visual height in 3D is tricky with CSS, we simulate top cap
                        }}
                    >
                         {/* Stud Top Cap */}
                         <div 
                            className={cn("absolute inset-0 rounded-full flex items-center justify-center", color)}
                            style={{ 
                                transform: `translateZ(${studHeight}px)`,
                                filter: "brightness(1.15)",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }} 
                         >
                            {/* Tiny stud highlight */}
                            <div className="w-1/2 h-1/2 rounded-full bg-white/10 blur-[1px]" />
                         </div>
                         {/* Stud Side (cylinder simulation - simplified as layer) */}
                         <div 
                            className={cn("absolute inset-0 rounded-full", color)}
                            style={{ 
                                transform: `translateZ(${studHeight/2}px)`,
                                filter: "brightness(0.8)"
                            }} 
                         />
                    </div>
                )
            })}

            {/* Top Face */}
            <div 
                className={cn("absolute inset-0", color)}
                style={{ 
                    transform: `translateZ(${height}px)`,
                    filter: "brightness(1)"
                }} 
            >
                {/* Glint effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30" />
            </div>

            {/* Front Face */}
            <div 
                className={cn("absolute w-full origin-bottom", color)}
                style={{ 
                    height: height,
                    bottom: 0,
                    transform: `rotateX(-90deg) translateZ(${depth * unitSize}px)`, // Adjust position to front edge
                    filter: "brightness(0.8)"
                }} 
            />

            {/* Back Face */}
            <div 
                className={cn("absolute w-full origin-bottom", color)}
                style={{ 
                    height: height,
                    bottom: 0,
                    transform: `rotateX(-90deg) rotateY(180deg)`, // Back edge
                    filter: "brightness(0.6)"
                }} 
            />

            {/* Left Face */}
            <div 
                className={cn("absolute h-full origin-left", color)}
                style={{ 
                    width: height, // Width of side is height of brick
                    left: 0,
                    transform: `rotateY(-90deg) rotateZ(90deg)`, 
                    filter: "brightness(0.7)"
                }} 
            />

            {/* Right Face */}
             <div 
                className={cn("absolute h-full origin-right", color)}
                style={{ 
                    width: height,
                    right: 0,
                    transform: `rotateY(90deg) rotateZ(-90deg)`,
                    filter: "brightness(0.5)"
                }} 
            />
        </div>
    )
}

