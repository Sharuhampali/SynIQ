"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Upload, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Brain },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/query", label: "Query", icon: MessageSquare },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="text-xl font-bold">SynIQ</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" asChild>
                    <Link href={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
