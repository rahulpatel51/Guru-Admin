"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { signOut, useSession } from "next-auth/react"

interface Notification {
  id: number
  title: string
  message: string
  time: string
}

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [pageTitle, setPageTitle] = useState<string>("")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Order",
      message: "You have received a new order",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Product 'Wireless Headphones' is running low on stock",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of ₹12,500 has been received",
      time: "3 hours ago",
    },
  ])

  useEffect(() => {
    // Set page title based on pathname
    const path = pathname.split("/")[1]
    if (!path) return setPageTitle("Dashboard")

    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "))
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div>
        <h1 className="text-xl font-bold">Welcome back, {session?.user?.name?.split(" ")[0] || "Admin"}!</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening today</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-64 rounded-full bg-background pl-8" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="cursor-pointer">
                  <div className="flex flex-col gap-1 py-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-2 px-4 text-center text-sm text-muted-foreground">No new notifications</div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="w-full cursor-pointer text-center text-primary">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {session?.user?.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

