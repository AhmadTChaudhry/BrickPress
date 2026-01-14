"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Theme = "galactic-conquest" | "ninja-warriors" | "urban-metropolis" | "fantasy-realm" | "deep-sea-adventure" | null

interface ThemeSelectorProps {
    selectedTheme: Theme
    onThemeSelect: (theme: Theme) => void
    onFeelingLucky: () => void
    useOriginalPrompt?: boolean
}

const themes = [
    { id: "galactic-conquest" as Theme, name: "Galactic Conquest", emoji: "🚀", color: "from-purple-500 to-blue-500" },
    { id: "ninja-warriors" as Theme, name: "Ninja Warriors", emoji: "🥷", color: "from-red-500 to-orange-500" },
    { id: "urban-metropolis" as Theme, name: "Urban Metropolis", emoji: "🏙️", color: "from-blue-400 to-cyan-500" },
    { id: "fantasy-realm" as Theme, name: "Fantasy Realm", emoji: "🏰", color: "from-purple-600 to-pink-500" },
    { id: "deep-sea-adventure" as Theme, name: "Deep Sea Adventure", emoji: "🌊", color: "from-blue-600 to-teal-500" },
]

export function ThemeSelector({ selectedTheme, onThemeSelect, onFeelingLucky, useOriginalPrompt = false }: ThemeSelectorProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <label className="text-sm font-medium leading-none block">
                Choose Your Universe
            </label>
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3"
            >
                {themes.map((theme) => (
                    <motion.div key={theme.id} variants={item}>
                        <Card
                            className={cn(
                                "p-4 cursor-pointer transition-all hover:scale-105 border-2",
                                selectedTheme === theme.id
                                    ? "border-primary shadow-lg"
                                    : "border-muted hover:border-primary/50"
                            )}
                            onClick={() => onThemeSelect(theme.id)}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-3xl">{theme.emoji}</div>
                                <div className={cn(
                                    "text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent",
                                    theme.color
                                )}>
                                    {theme.name}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
                {/* Let us decide option */}
                <motion.div variants={item}>
                    <Card
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:scale-105 border-2",
                            useOriginalPrompt
                                ? "border-primary shadow-lg"
                                : "border-muted hover:border-primary/50"
                        )}
                        onClick={onFeelingLucky}
                    >
                        <div className="text-center space-y-2">
                            <div className="text-3xl">🎲</div>
                            <div className="text-sm font-semibold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                                Let us decide
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}

