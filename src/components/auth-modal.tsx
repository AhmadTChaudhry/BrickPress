"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { Loader2, User, Lock, Mail, ArrowRight, Fingerprint } from "lucide-react"
import { toast } from "sonner"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [passkeyLoading, setPasskeyLoading] = useState(false)

    const handlePasskeySignIn = async () => {
        setPasskeyLoading(true)
        try {
            const { data, error } = await authClient.signIn.passkey();
            if (error) {
                toast.error(error.message || "Passkey sign-in failed");
            } else {
                toast.success("Logged in with Passkey!");
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred during Passkey sign-in");
        } finally {
            setPasskeyLoading(false)
        }
    }

    const handlePasskeySignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !password) {
            toast.error("Please fill in all fields to register with a Passkey")
            return
        }
        
        setPasskeyLoading(true)
        try {
            // 1. Create the account
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/",
            })

            if (error) {
                toast.error(error.message || "Signup failed")
                return
            }

            // 2. Trigger Passkey registration immediately
            toast.info("Account created! Let's secure it with a Passkey...")
            const { error: passkeyError } = await authClient.passkey.addPasskey({
                name: `${name}'s Passkey`,
            })

            if (passkeyError) {
                toast.warning("Account created, but Passkey registration was skipped.")
            } else {
                toast.success("Account created and secured with Passkey!")
            }
            onClose()
        } catch (err) {
            console.error(err)
            toast.error("An unexpected error occurred during Passkey registration")
        } finally {
            setPasskeyLoading(false)
        }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: "/",
                })
                toast.success("Account created! Please sign in.")
                setIsSignUp(false)
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                    callbackURL: "/",
                })
                toast.success("Logged in successfully!")
                onClose()
            }
        } catch (error) {
            toast.error("Authentication failed. Please check your credentials.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 relative overflow-hidden">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="relative space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                                {isSignUp ? "Join BrickPress" : "Welcome Back"}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {isSignUp 
                                    ? "Create an account to save your masterpieces" 
                                    : "Sign in to access your creation gallery"}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {isSignUp && (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full font-bold h-12 text-lg shadow-lg shadow-primary/20"
                                disabled={loading || passkeyLoading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? "Create Account" : "Sign In"}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={isSignUp ? handlePasskeySignUp : handlePasskeySignIn}
                                className="w-full h-12 font-bold border-2 hover:bg-primary/5 transition-colors"
                                disabled={loading || passkeyLoading}
                            >
                                {passkeyLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Fingerprint className="mr-2 h-5 w-5 text-primary" />
                                        {isSignUp ? "Sign Up with Passkey" : "Sign in with Passkey"}
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="text-center pt-2">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                            >
                                {isSignUp 
                                    ? "Already have an account? Sign In" 
                                    : "Don't have an account? Create one"}
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            className="w-full text-xs text-muted-foreground"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}

