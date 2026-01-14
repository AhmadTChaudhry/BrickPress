"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LegoBrick } from "@/components/lego-brick"
import { Camera } from "lucide-react"

interface IntroAnimationProps {
    onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
    const [phase, setPhase] = useState<"build" | "snap" | "flash" | "done">("build")

    useEffect(() => {
        // Sequence timeline
        const snapTimer = setTimeout(() => setPhase("snap"), 2000) // Start camera UI after build
        const flashTimer = setTimeout(() => setPhase("flash"), 2600) // Flash trigger
        const completeTimer = setTimeout(() => {
            setPhase("done")
            onComplete()
        }, 3200)

        return () => {
            clearTimeout(snapTimer)
            clearTimeout(flashTimer)
            clearTimeout(completeTimer)
        }
    }, [onComplete])

    // Brick Layout: Building a more substantial camera/product shape
    const bricks = [
        // Layer 0 - Base (Black/Dark Zinc for "pro" look)
        { id: "b1", color: "bg-zinc-800", w: 4, d: 2, x: -1, y: 0, z: 0, delay: 0.1 },
        { id: "b2", color: "bg-zinc-800", w: 2, d: 2, x: 3, y: 0, z: 0, delay: 0.15 },
        { id: "b3", color: "bg-zinc-800", w: 6, d: 1, x: -1, y: -1, z: 0, delay: 0.2 },
        // Layer 1 - Body (The main color - premium red)
        { id: "b4", color: "bg-red-600", w: 6, d: 2, x: -1, y: 0, z: 1, delay: 0.4 },
        { id: "b5", color: "bg-red-600", w: 6, d: 1, x: -1, y: -1, z: 1, delay: 0.45 },
        // Layer 2 - Top Details
        { id: "b6", color: "bg-red-600", w: 2, d: 2, x: 1, y: 0, z: 2, delay: 0.7 }, // Viewfinder base
        { id: "b7", color: "bg-zinc-700", w: 1, d: 1, x: 4, y: 0, z: 2, delay: 0.8 }, // Shutter
        // Lens - Stacking small bricks to simulate a cylinder
        { id: "l1", color: "bg-zinc-900", w: 2, d: 2, x: 1, y: -2, z: 0, delay: 0.5 },
        { id: "l2", color: "bg-zinc-900", w: 2, d: 2, x: 1, y: -2, z: 1, delay: 0.6 },
    ]

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    key="intro-container"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 perspective-1000 overflow-hidden"
                    exit={{ opacity: 0 }}
                >
                    {/* Background Detail: Subtle Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
                    />

                    {/* 3D Scene Container */}
                    <motion.div 
                        className="relative w-64 h-64 transform-style-3d"
                        initial={{ rotateX: 70, rotateZ: 30, scale: 0.8, y: 200 }}
                        animate={{ 
                            rotateX: phase === "build" ? 70 : 55, 
                            rotateZ: phase === "build" ? 30 : 45,
                            y: phase === "build" ? 100 : 0,
                            scale: phase === "build" ? 1.2 : 1.5
                        }}
                        transition={{ 
                            duration: 2, 
                            ease: "easeOut" 
                        }}
                    >
                        {/* Ground/Shadow Plane */}
                        <div 
                            className="absolute inset-0 bg-black/40 blur-2xl rounded-full"
                            style={{ transform: "translateZ(-2px) scale(1.5)" }}
                        />

                        {bricks.map((brick) => (
                            <motion.div
                                key={brick.id}
                                className="absolute transform-style-3d"
                                style={{
                                    left: brick.x * 24, // Unit size 24px
                                    top: brick.y * 24,
                                    zIndex: brick.z
                                }}
                                initial={{ 
                                    z: 800, 
                                    opacity: 0 
                                }}
                                animate={{ 
                                    z: brick.z * 24, // Stack height
                                    opacity: 1 
                                }}
                                transition={{ 
                                    type: "spring",
                                    damping: 12,
                                    stiffness: 150,
                                    delay: brick.delay 
                                }}
                            >
                                <LegoBrick 
                                    color={brick.color} 
                                    width={brick.w} 
                                    depth={brick.d} 
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Camera Viewfinder Overlay */}
                    {phase === "snap" && (
                        <motion.div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {/* Focus Brackets */}
                            <div className="relative w-[80%] h-[60%] border-2 border-white/50 rounded-lg">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1" />
                                
                                {/* Center Crosshair */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                    <div className="w-4 h-4 border border-white rounded-full" />
                                </div>
                            </div>
                            
                            {/* Data Overlay */}
                            <div className="absolute bottom-12 left-0 w-full text-center text-white/80 font-mono text-sm tracking-widest">
                                REC [ 00:00:01 ]
                            </div>
                        </motion.div>
                    )}

                    {/* Flash Effect */}
                    {phase === "flash" && (
                        <motion.div 
                            className="absolute inset-0 bg-white z-[60]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.6, times: [0, 0.1, 1] }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
