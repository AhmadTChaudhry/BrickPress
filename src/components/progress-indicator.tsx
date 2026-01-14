"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
    currentStep: 1 | 2 | 3
    totalSteps?: number
}

const steps = [
    { number: 1, name: "Upload & Details" },
    { number: 2, name: "Choose Theme" },
    { number: 3, name: "Result" },
]

export function ProgressIndicator({ currentStep, totalSteps = 3 }: ProgressIndicatorProps) {
    return (
        <div className="w-full max-w-md mx-auto mb-6">
            {/* Step Numbers */}
            <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                    currentStep >= step.number
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {step.number}
                            </div>
                            <span
                                className={cn(
                                    "text-xs mt-1 text-center",
                                    currentStep >= step.number
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                {step.name}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "h-0.5 flex-1 mx-2 transition-colors",
                                    currentStep > step.number
                                        ? "bg-primary"
                                        : "bg-muted"
                                )}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            {/* Progress Text */}
            <div className="text-center text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
            </div>
        </div>
    )
}

