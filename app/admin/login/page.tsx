"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/routes"
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store"
import { Store, Lock, KeyRound, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { login } = useAdminAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Simulate network delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (login(email, password)) {
            router.push(ROUTES.admin + "/dashboard")
        } else {
            setError("Identifiants incorrects. Veuillez réessayer.")
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Nouveau fond : Animated Elegant Gradient Mesh inspired by the logo (Deep Blue #312783) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0f1c]">
                <div
                    className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#312783]/40 via-[#1a1744]/20 to-transparent animate-[spin_60s_linear_infinite]"
                    style={{ transformOrigin: "center center" }}
                />
                <div
                    className="absolute inset-[-50%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent animate-[spin_90s_linear_infinite_reverse]"
                    style={{ transformOrigin: "center center" }}
                />
                <div className="absolute inset-0 bg-background/30 backdrop-blur-[60px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full sm:max-w-[420px] px-4 sm:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden backdrop-blur-xl bg-card/70 border border-white/10 dark:border-white/5 shadow-[0_0_50px_-12px_rgba(49,39,131,0.5)] sm:rounded-3xl p-8 sm:p-12 before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-b before:from-white/10 before:to-transparent dark:before:from-white/[0.05]"
                >
                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-10">
                        <Link href={ROUTES.home} className="mb-6 relative group inline-block">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt="TONOMI"
                                    width={220}
                                    height={110}
                                    className="h-24 w-auto object-contain drop-shadow-lg"
                                    priority
                                />
                            </motion.div>
                        </Link>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center"
                        >
                            Administration
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-2 text-sm text-muted-foreground text-center"
                        >
                            Connectez-vous pour accéder au tableau de bord.
                        </motion.p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4 shrink-0" />
                                <p className="leading-tight">{error}</p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="email" className="text-foreground/80 font-medium">Adresse email</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@tonomi.com"
                                    className="pl-10 bg-background/50 focus:bg-background transition-colors h-12 rounded-xl"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-foreground/80 font-medium">Mot de passe</Label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <KeyRound className="h-4 w-4" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 bg-background/50 focus:bg-background transition-colors h-12 rounded-xl"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="pt-2"
                        >
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                loading={isLoading}
                            >
                                Se connecter
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-8 pt-6 border-t border-border/50"
                    >
                        <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground h-12 rounded-xl" asChild>
                            <Link href={ROUTES.home}>
                                <Store className="w-5 h-5" />
                                Retourner à la boutique
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
