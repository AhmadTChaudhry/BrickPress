"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Missing Label component, I should add it or just use simple label. 
// I'll use simple label element to avoid creating another file right now, keeping it simple.

interface CreationFormProps {
    name: string
    setName: (v: string) => void
    description: string
    setDescription: (v: string) => void
}

export function CreationForm({
    name,
    setName,
    description,
    setDescription,
}: CreationFormProps) {
    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Creation Name
                </label>
                <Input
                    id="name"
                    placeholder="e.g. The Star Voyager"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg font-medium"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                </label>
                <Textarea
                    id="description"
                    placeholder="What makes this creation special? (e.g. features, backstory)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
        </div>
    )
}
