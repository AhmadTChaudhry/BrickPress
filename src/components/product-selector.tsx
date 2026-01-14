"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { products, type Product } from "@/lib/products"
import { ShoppingCart, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductSelectorProps {
    selectedProduct: Product | null
    onSelect: (product: Product) => void
    generatedImage: string
}

export function ProductSelector({ selectedProduct, onSelect, generatedImage }: ProductSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
                <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Card
                        className={cn(
                            "cursor-pointer overflow-hidden transition-all border-2 h-full flex flex-col",
                            selectedProduct?.id === product.id
                                ? "border-primary shadow-lg ring-2 ring-primary ring-offset-2"
                                : "border-muted hover:border-primary/50"
                        )}
                        onClick={() => onSelect(product)}
                    >
                        {/* Mockup Preview Area */}
                        <div className="relative aspect-video bg-muted/50 p-4 flex items-center justify-center overflow-hidden group">
                            <div className={cn(
                                "relative shadow-xl transition-transform duration-300",
                                product.type === "canvas" ? "border-[8px] border-black bg-white" : "bg-white",
                                product.type === "sticker" ? "rotate-3" : "",
                                selectedProduct?.id === product.id ? "scale-105" : "group-hover:scale-105"
                            )}>
                                {/* Simulated Product Frame/Sheet */}
                                <div className={cn(
                                    "relative overflow-hidden",
                                    product.type === "poster" ? "w-24 h-32" :
                                    product.type === "canvas" ? "w-28 h-24" :
                                    "w-32 h-24"
                                )}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={generatedImage} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-sm">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground">{product.dimensions}</p>
                                </div>
                                <span className="font-bold text-primary">${product.price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4 flex-1">
                                {product.description}
                            </p>
                            <Button 
                                size="sm" 
                                variant={selectedProduct?.id === product.id ? "default" : "outline"}
                                className="w-full"
                            >
                                {selectedProduct?.id === product.id ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> Selected
                                    </>
                                ) : (
                                    <>
                                        Select
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

