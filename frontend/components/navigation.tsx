"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Upload, Package, ChefHat } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "画像アップロード", icon: Upload, color: "bg-pink-100 text-pink-700" },
    { href: "/inventory", label: "在庫管理", icon: Package, color: "bg-cyan-100 text-cyan-700" },
    { href: "/recipes", label: "レシピ提案", icon: ChefHat, color: "bg-amber-100 text-amber-700" },
  ]

  return (
    <nav className="bg-pink-50/50 border-b border-border/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pink-200 flex items-center justify-center shadow-sm">
              <Package className="w-6 h-6 text-pink-700" />
            </div>
            <h1 className="text-xl font-bold text-pink-700">冷蔵庫管理</h1>
          </div>

          <div className="flex gap-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${link.color} shadow-md`
                      : "text-muted-foreground hover:bg-white/80 hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
