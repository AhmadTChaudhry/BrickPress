"use client"

import React from "react"
import { useQuery } from "convex/react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Loader2, History } from "lucide-react"

export function CreationsGallery() {
    // Using string-based query to avoid build errors with missing generated files
    const generations = useQuery("generations:getRecentGenerations" as any, {})

    if (generations === undefined) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (generations.length === 0) {
        return null // Don't show if empty
    }

    return (
        <section className="space-y-6 pt-12 border-t mt-12">
            <div className="flex items-center gap-2 mb-6">
                <History className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black">Recent Creations</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generations.map((gen, index) => (
                    <motion.div
                        key={gen._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="aspect-[3/4] relative bg-muted">
                                {gen.imageUrl ? (
                                    <img 
                                        src={gen.imageUrl} 
                                        alt={gen.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 className="animate-spin text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                                    <p className="font-bold text-sm truncate">{gen.name}</p>
                                    <p className="text-xs text-white/70 truncate uppercase">{gen.theme}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

