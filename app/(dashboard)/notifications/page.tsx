"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trash2, Check, RefreshCw } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  timestamp: string
  link?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching notifications
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: "1",
          title: "New Order Received",
          message: "You have received a new order #12345 from John Doe.",
          type: "info",
          isRead: false,
          timestamp: "2023-07-15T10:30:00",
        },
        {
          id: "2",
          title: "Payment Successful",
          message: "Payment of ₹12,500 has been received for order #12345.",
          type: "success",
          isRead: false,
          timestamp: "2023-07-15T10:35:00",
        },
        {
          id: "3",
          title: "Low Stock Alert",
          message: "Product 'Wireless Headphones' is running low on stock. Only 5 items left.",
          type: "warning",
          isRead: true,
          timestamp: "2023-07-14T15:20:00",
        },
        {
          id: "4",
          title: "Payment Failed",
          message: "Payment for order #12349 has failed. Please check the payment details.",
          type: "error",
          isRead: true,
          timestamp: "2023-07-14T09:45:00",
        },
        {
          id: "5",
          title: "New Employee Added",
          message: "A new employee 'Sarah Brown' has been added to the system.",
          type: "info",
          isRead: true,
          timestamp: "2023-07-13T14:10:00",
        },
        {
          id: "6",
          title: "Order Shipped",
          message: "Order #12340 has been shipped to the customer.",
          type: "success",
          isRead: true,
          timestamp: "2023-07-13T11:25:00",
        },
        {
          id: "7",
          title: "System Update",
          message: "The system will undergo maintenance on July 20, 2023, from 2:00 AM to 4:00 AM.",
          type: "info",
          isRead: true,
          timestamp: "2023-07-12T16:30:00",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted successfully.",
    })
  }

  const handleClearAll = () => {
    setNotifications([])
    toast({
      title: "All notifications cleared",
      description: "All notifications have been cleared successfully.",
    })
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Manage your notifications and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleMarkAllAsRead}
            disabled={isLoading || unreadCount === 0}
          >
            <Check className="h-4 w-4" /> Mark All as Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleClearAll}
            disabled={isLoading || notifications.length === 0}
          >
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" /> Loading...
            </div>
          )}
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-lg border p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You don&apos;t have any {activeTab !== "all" ? activeTab : ""} notifications at the moment.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-lg border p-4 ${!notification.isRead ? "bg-muted/40" : ""}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {notification.link && (
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Details
                      </Button>
                    )}
                    <div className="ml-auto flex gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(notification.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

