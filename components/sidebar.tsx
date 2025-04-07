"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FolderTree,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"

interface SidebarLink {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

interface SidebarLinkGroupProps {
  title: string
  links: SidebarLink[]
  pathname: string
}

const mainLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
]

const inventoryLinks: SidebarLink[] = [
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    badge: 12,
  },
]

const managementLinks: SidebarLink[] = [
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: FileText,
  },
]

const accountLinks: SidebarLink[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: 3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsMobileOpen(false)
  }, [pathname])

  if (!isMounted) return null

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center">
              <div className="mr-2 rounded-md bg-primary p-1">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">AdminHub</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center border-b px-6 py-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
              {session?.user?.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium">{session?.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email || "user@example.com"}</p>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="flex flex-col gap-1">
              <SidebarLinkGroup title="Main" links={mainLinks} pathname={pathname} />
              <SidebarLinkGroup title="Inventory" links={inventoryLinks} pathname={pathname} />
              <SidebarLinkGroup title="Management" links={managementLinks} pathname={pathname} />
              <SidebarLinkGroup title="Account" links={accountLinks} pathname={pathname} />
            </nav>
          </ScrollArea>

          {/* Logout */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

function SidebarLinkGroup({ title, links, pathname }: SidebarLinkGroupProps) {
  return (
    <div className="py-2">
      <p className="px-4 py-1 text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      {links.map((link) => (
        <NavLink key={link.href} link={link} pathname={pathname} />
      ))}
    </div>
  )
}

function NavLink({
  link,
  pathname,
}: {
  link: SidebarLink
  pathname: string
}) {
  const isActive = pathname.startsWith(link.href)
  const Icon = link.icon

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{link.title}</span>
      {link.badge && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-xs font-medium">
          {link.badge}
        </span>
      )}
    </Link>
  )
}

