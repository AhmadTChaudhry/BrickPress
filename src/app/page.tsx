"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CameraUpload } from "@/components/camera-upload"
import { CreationForm } from "@/components/creation-form"
import { ThemeSelector, type Theme } from "@/components/theme-selector"
import { ProgressIndicator } from "@/components/progress-indicator"
import { ProgressBar } from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, ArrowRight, Download, Share2, Eye, ShoppingCart, LogIn, UserCircle, Database } from "lucide-react"
import { toast } from "sonner"
import { PrintShopModal } from "@/components/print-shop-modal"
import { IntroAnimation } from "@/components/intro-animation"
import { CreationsGallery } from "@/components/creations-gallery"
import { authClient } from "@/lib/auth-client"
import { AuthModal } from "@/components/auth-modal"

export default function Home() {
  const { data: session, isPending: isAuthPending } = authClient.useSession()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<Theme>(null)
  const [useOriginalPrompt, setUseOriginalPrompt] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Check session storage on mount
  React.useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("brickpress-intro-seen")
    if (hasSeenIntro) {
      setShowIntro(false)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    sessionStorage.setItem("brickpress-intro-seen", "true")
  }

  const handleNext = () => {
    if (!session) {
      setIsAuthModalOpen(true)
      return
    }
    if (image && name) {
      setCurrentStep(2)
      setError(null)
    }
  }

  const handleImageSelect = (file: File | null) => {
    setImage(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

    const handleGenerate = async () => {
    if (!image) return
    if (!useOriginalPrompt && !selectedTheme) {
      toast.error("Please select a universe or use 'I'm Feeling Lucky'")
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", image)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("theme", selectedTheme || "")
      formData.append("modelType", "unknown")
      formData.append("useOriginalPrompt", useOriginalPrompt.toString())
      if (session?.user?.id) {
        formData.append("userId", session.user.id)
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate brochure. Please check API configuration.")
      }

      const data = await response.json()
      setResult(data.image)
      setCurrentStep(3)
      toast.success("Brochure generated successfully!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleFeelingLucky = () => {
    setSelectedTheme(null)
    setUseOriginalPrompt(true)
  }

  const handleCreateAnother = () => {
    setCurrentStep(1)
    setResult(null)
    setImage(null)
    setName("")
    setDescription("")
    setSelectedTheme(null)
    setUseOriginalPrompt(false)
    setError(null)
  }

  const handleDownload = () => {
    if (!result) return
    
    // Extract base64 data from data URL
    const base64Data = result.split(',')[1]
    const mimeType = result.split(';')[0].split(':')[1] || 'image/png'
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name || 'brickpress-poster'}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleRegisterPasskey = async () => {
    try {
      const { data, error } = await authClient.passkey.addPasskey();
      if (error) {
        toast.error(error.message || "Passkey registration failed");
      } else {
        toast.success("Passkey registered successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during Passkey registration");
    }
  }

  const handleSaveToConvex = async () => {
    if (!result) return;
    if (!session) {
      toast.error("Please sign in to save creations");
      return;
    }
    const toastId = toast.loading("Debug: Saving to Convex...");
    try {
      const response = await fetch("/api/save-creation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: result,
          name: name || "Debug Creation",
          description: description || "Manually saved for debugging",
          theme: selectedTheme || "Debug",
          userId: session.user.id, // Pass userId from client session
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      
      toast.success("Debug: Saved to Convex!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Debug Save Failed: " + (err instanceof Error ? err.message : String(err)), { id: toastId });
    }
  }

  const handleShare = async () => {
    if (!result) return

    try {
      const base64Data = result.split(',')[1]
      const mimeType = result.split(';')[0].split(':')[1] || 'image/png'
      
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      const file = new File([blob], `${name || 'brickpress-poster'}.png`, { type: mimeType })

      if (navigator.share) {
        await navigator.share({
          title: `BrickPress: ${name}`,
          text: `Check out my LEGO creation: ${name}! Created with BrickPress.`,
          files: [file]
        })
        toast.success("Shared successfully!")
      } else {
        toast.error("Sharing is not supported on this device")
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Error sharing:", err)
        toast.error("Failed to share")
      }
    }
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto flex flex-col gap-8"
      >
        {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center space-y-2 mb-8 relative">
        <div className="absolute right-0 top-0">
          {!isAuthPending && (
            session ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold truncate max-w-[100px]">{session.user.name}</p>
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={handleRegisterPasskey}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Add Passkey
                    </button>
                    <button 
                      onClick={() => authClient.signOut()} 
                      className="text-[10px] text-muted-foreground hover:text-primary underline"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAuthModalOpen(true)}
                className="font-bold text-xs"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          BrickPress
        </h1>
        <p className="text-muted-foreground text-lg">
          Turn your Lego creations into professional brochures instantly.
        </p>
      </header>

      {/* Progress Indicator */}
      {currentStep !== 3 && (
        <ProgressIndicator currentStep={currentStep} />
      )}

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step 1: Upload + Details */}
            <section className="space-y-6">
              <CameraUpload onImageSelect={handleImageSelect} selectedImage={image} />
              
              {image && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CreationForm
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                  />
                </motion.div>
              )}

              <div className="flex justify-center pt-4">
                <motion.div whileTap={{ scale: 0.95 }} className="w-full max-w-md">
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!image || !name}
                    className="w-full text-lg font-bold shadow-lg shadow-primary/20"
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step 2: Theme Selection */}
            <section className="space-y-6">
              <ThemeSelector
                selectedTheme={selectedTheme}
                onThemeSelect={(theme) => {
                  setSelectedTheme(theme)
                  setUseOriginalPrompt(false)
                }}
                onFeelingLucky={handleFeelingLucky}
                useOriginalPrompt={useOriginalPrompt}
              />

              {loading && (
                <ProgressBar isLoading={loading} />
              )}

              <div className="flex justify-center pt-4">
                <motion.div whileTap={{ scale: 0.95 }} className="w-full max-w-md">
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={loading || (!selectedTheme && !useOriginalPrompt)}
                    className="w-full text-lg font-bold shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Brochure
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}
            </section>
          </motion.div>
        )}

        {currentStep === 3 && result && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Step 3: Result */}
            <div className="relative w-full max-w-md">
              <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden relative group">
                {/* Generated Image */}
                <motion.img
                  src={result}
                  alt="Generated LEGO Brochure"
                  className="w-full h-auto"
                  animate={{ opacity: showOriginal ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Original Image Overlay */}
                {preview && (
                  <motion.div
                    className="absolute inset-0 bg-black/5 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showOriginal ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Original Creation"
                      className="w-full h-full object-contain p-4"
                    />
                  </motion.div>
                )}

                {/* Compare Toggle Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Hold to Compare
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                <Button 
                  variant="outline" 
                  onClick={handleCreateAnother}
                  className="w-full"
                >
                  Create Another
                </Button>
              </motion.div>
              <div className="flex gap-2 flex-1">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="px-3"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button 
                    onClick={() => setIsPrintModalOpen(true)}
                    className="w-full bg-gradient-to-r from-primary to-orange-500 text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Print
                  </Button>
                </motion.div>
              </div>
            </div>
            
            <div className="w-full max-w-md space-y-4">
                <Button 
                  onClick={handleDownload} 
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Digital Copy
                </Button>

                <Button 
                  onClick={handleSaveToConvex} 
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Debug: Save to Convex
                </Button>
            </div>

            {/* Print Shop Modal */}
            <PrintShopModal 
                isOpen={isPrintModalOpen} 
                onClose={() => setIsPrintModalOpen(false)} 
                generatedImage={result}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreationsGallery />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      </motion.main>
    </>
  )
}
