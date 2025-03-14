"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, LayoutDashboard, Menu, MessageSquare, MoonIcon, SunIcon, X, Calendar, Briefcase } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quote Requests",
    href: "/dashboard/quote-requests",
    icon: MessageSquare,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: Briefcase,
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Information",
    href: "/dashboard/information",
    icon: Info,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  // Initialize theme on component mount
  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = prefersDark ? "dark" : "light"
    setTheme(initialTheme)

    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Close mobile nav when path changes
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileNavOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileNavOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="grid gap-1 p-4">
            {navItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                asChild
                className={cn("justify-start", pathname === item.href && "bg-accent text-accent-foreground")}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background transition-all duration-300 ease-in-out md:flex md:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.title}>
                <Button
                  variant="ghost"
                  asChild
                  className={cn("w-full justify-start", pathname === item.href && "bg-accent text-accent-foreground")}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-auto">
            {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out md:ml-64">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

