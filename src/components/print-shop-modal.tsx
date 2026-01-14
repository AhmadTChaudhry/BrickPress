"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductSelector } from "@/components/product-selector"
import { type Product } from "@/lib/products"
import { Loader2, ShoppingBag, CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

// Implementing a custom Modal since Dialog components might not be installed
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {children}
            </motion.div>
        </div>
    )
}

interface PrintShopModalProps {
    isOpen: boolean
    onClose: () => void
    generatedImage: string
}

export function PrintShopModal({ isOpen, onClose, generatedImage }: PrintShopModalProps) {
    const [step, setStep] = useState<"select" | "shipping" | "processing" | "success">("select")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(false)

    // Mock Shipping Form State
    const [shipping, setShipping] = useState({
        name: "",
        address: "",
        city: "",
        zip: ""
    })

    const reset = () => {
        setStep("select")
        setSelectedProduct(null)
        setLoading(false)
        setShipping({ name: "", address: "", city: "", zip: "" })
    }

    const handleCheckout = async () => {
        setStep("processing")
        setLoading(true)
        
        // Mock upscale and payment delay
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        setLoading(false)
        setStep("success")
        toast.success("Order placed successfully!")
    }

    const handleClose = () => {
        onClose()
        // Reset after animation
        setTimeout(reset, 300)
    }

    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                        <ShoppingBag className="text-primary" />
                        BrickPress Print Shop
                    </h2>
                    <Button variant="ghost" size="icon" onClick={handleClose}>✕</Button>
                </div>

                <AnimatePresence mode="wait">
                    {step === "select" && (
                        <motion.div 
                            key="select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <p className="text-muted-foreground">Select a high-quality product for your masterpiece.</p>
                            <ProductSelector 
                                generatedImage={generatedImage}
                                selectedProduct={selectedProduct}
                                onSelect={setSelectedProduct}
                            />
                            <div className="flex justify-end pt-4">
                                <Button 
                                    size="lg" 
                                    disabled={!selectedProduct}
                                    onClick={() => setStep("shipping")}
                                    className="font-bold shadow-lg shadow-primary/20"
                                >
                                    Continue to Checkout
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "shipping" && (
                        <motion.div 
                            key="shipping"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-4 border">
                                <div className="w-16 h-16 rounded overflow-hidden bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={generatedImage} className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{selectedProduct?.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedProduct?.dimensions}</p>
                                    <p className="font-bold text-primary">${selectedProduct?.price}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Truck className="w-4 h-4" /> Shipping Details
                                </h3>
                                <div className="grid gap-4">
                                    <Input 
                                        placeholder="Full Name" 
                                        value={shipping.name} 
                                        onChange={e => setShipping({...shipping, name: e.target.value})}
                                    />
                                    <Input 
                                        placeholder="Address" 
                                        value={shipping.address} 
                                        onChange={e => setShipping({...shipping, address: e.target.value})}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input 
                                            placeholder="City" 
                                            value={shipping.city} 
                                            onChange={e => setShipping({...shipping, city: e.target.value})}
                                        />
                                        <Input 
                                            placeholder="ZIP Code" 
                                            value={shipping.zip} 
                                            onChange={e => setShipping({...shipping, zip: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment (Mock)
                                </h3>
                                <div className="p-4 border rounded-lg bg-muted/20 text-sm text-muted-foreground text-center">
                                    No actual payment will be processed in this demo.
                                </div>
                            </div>

                            <div className="flex gap-4 justify-between pt-4">
                                <Button variant="outline" onClick={() => setStep("select")}>Back</Button>
                                <Button 
                                    size="lg" 
                                    onClick={handleCheckout}
                                    disabled={!shipping.name || !shipping.address}
                                    className="font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                >
                                    Place Order (${selectedProduct?.price})
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div 
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                        >
                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Processing Order...</h3>
                                <p className="text-muted-foreground animate-pulse">Upscaling image to 300 DPI for high-quality print...</p>
                            </div>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 space-y-6 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Order Confirmed!</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Your {selectedProduct?.name} is being prepared by our master builders. You will receive a tracking number shortly.
                                </p>
                            </div>
                            <Button size="lg" onClick={handleClose} className="min-w-[200px]">
                                Back to Gallery
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    )
}

