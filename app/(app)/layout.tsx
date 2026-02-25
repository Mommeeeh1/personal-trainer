'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, clearToken } from '@/lib/api-client'
import { LayoutDashboard, Dumbbell, BookOpen, TrendingUp, MessageSquare, Users, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plan', label: 'My Plan', icon: BookOpen },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    setUser(u)
    setMounted(true)
  }, [router])

  if (!mounted) return null

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  const navItems = user?.role === 'TRAINER'
    ? [...NAV_ITEMS, { href: '/clients', label: 'Clients', icon: Users }]
    : NAV_ITEMS

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">PT App</h2>
            {user?.name && (
              <p className="text-sm text-muted-foreground">{user.name}</p>
            )}
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t px-3 py-4">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="size-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b px-4 py-3 md:hidden">
          <h2 className="text-lg font-semibold">PT App</h2>
          <nav className="ml-auto flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="rounded-md p-2 hover:bg-accent">
                  <Icon className="size-5" />
                </Link>
              )
            })}
          </nav>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
