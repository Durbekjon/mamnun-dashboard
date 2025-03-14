"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, MoonIcon, SunIcon, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LOGIN, WHOAMI } from "@/services/login.service"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const fetchME = async () => {
      const { data, status } = await WHOAMI()
      console.log(data, status)
      if (status === 200) {
        redirect("/dashboard")
      }
    }
    fetchME()
  }, [])
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, status } = await LOGIN({ username, password })
      console.log(data)
      if (status === 201) {
        localStorage.setItem("access-token", data.accessToken)
        localStorage.setItem("refresh-token", data.refreshToken)
        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="absolute right-4 top-4 z-10">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
          {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="scale-in w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="pl-10"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 rounded-l-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full transition-all hover:shadow-lg" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

