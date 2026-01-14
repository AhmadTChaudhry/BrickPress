"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
    isLoading: boolean
    className?: string
}

export function ProgressBar({ isLoading, className }: ProgressBarProps) {
    const [progress, setProgress] = useState(0)

    const [messageIndex, setMessageIndex] = useState(0)

    const loadingMessages = [
        "Scanning brick structure...",
        "Consulting master builders...",
        "Analyzing color palette...",
        "Applying gloss finish...",
        "Printing high-gloss poster...",
        "Adding final touches..."
    ]

    useEffect(() => {
        if (!isLoading) {
            // Complete to 100% when loading finishes
            if (progress > 0 && progress < 100) {
                setProgress(100)
                const timer = setTimeout(() => setProgress(0), 500)
                return () => clearTimeout(timer)
            }
            return
        }

        // Reset and start progress when loading begins
        setProgress(0)
        setMessageIndex(0)

        // Simulate progress with steps
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    return prev // Hold at 90% until actual completion
                }
                // Increment more slowly as we approach 90%
                const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1
                return Math.min(prev + increment, 90)
            })
        }, 300)

        // Cycle through messages
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 2000)

        return () => {
            clearInterval(interval)
            clearInterval(messageInterval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    if (!isLoading && progress === 0) return null

    return (
        <div className={cn("w-full max-w-md mx-auto space-y-2", className)}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <motion.span
                    key={messageIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    {loadingMessages[messageIndex]}
                </motion.span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%`, opacity: [1, 0.8, 1] }}
                    transition={{ 
                        width: { duration: 0.3, ease: "easeOut" },
                        opacity: { duration: 1.5, repeat: Infinity, ease: "linear" }
                    }}
                />
            </div>
        </div>
    )
}

