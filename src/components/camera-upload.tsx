"use client"

import React, { useRef, useState } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CameraUploadProps {
    onImageSelect: (file: File | null) => void
    selectedImage: File | null
}

export function CameraUpload({ onImageSelect, selectedImage }: CameraUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            processFile(file)
        }
    }

    const processFile = (file: File) => {
        onImageSelect(file)
        const url = URL.createObjectURL(file)
        setPreview(url)
    }

    const clearImage = () => {
        onImageSelect(null)
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        if (cameraInputRef.current) cameraInputRef.current.value = ""
    }

    const handleTakePhoto = () => {
        cameraInputRef.current?.click()
    }

    const handleUploadFromGallery = () => {
        fileInputRef.current?.click()
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    return (
        <div className="w-full">
            {preview ? (
                <Card className="relative overflow-hidden p-2 group">
                    <div className="aspect-square w-full relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full rounded-lg object-cover"
                        />
                    </div>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 rounded-full opacity-90 hover:opacity-100"
                        onClick={clearImage}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </Card>
            ) : (
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="flex flex-col items-center space-y-4 text-center p-4">
                        <div className="p-4 rounded-full bg-muted">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">Capture or Upload</p>
                            <p className="text-sm text-muted-foreground">
                                Drag & drop or click to select your creation
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleTakePhoto()
                                }}
                            >
                                <Camera className="mr-2 h-4 w-4" /> Take Photo
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleUploadFromGallery()
                                }}
                            >
                                <Upload className="mr-2 h-4 w-4" /> Upload
                            </Button>
                        </div>
                    </div>
                    {/* File input for gallery/upload (no capture attribute) */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {/* File input for camera capture */}
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    )
}
