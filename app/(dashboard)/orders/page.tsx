"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  date: string
  items: number
  total: number
  status: "Completed" | "Processing" | "On Hold" | "Cancelled"
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching orders
    const timer = setTimeout(() => {
      setOrders([
        {
          id: "1",
          orderNumber: "#ORD-12345",
          customer: {
            name: "John Doe",
            email: "john@example.com",
          },
          date: "2023-07-15",
          items: 3,
          total: 12500,
          status: "Completed",
        },
        {
          id: "2",
          orderNumber: "#ORD-12346",
          customer: {
            name: "Jane Smith",
            email: "jane@example.com",
          },
          date: "2023-07-14",
          items: 2,
          total: 8750,
          status: "Processing",
        },
        {
          id: "3",
          orderNumber: "#ORD-12347",
          customer: {
            name: "Robert Johnson",
            email: "robert@example.com",
          },
          date: "2023-07-14",
          items: 1,
          total: 5200,
          status: "On Hold",
        },
        {
          id: "4",
          orderNumber: "#ORD-12348",
          customer: {
            name: "Emily Davis",
            email: "emily@example.com",
          },
          date: "2023-07-13",
          items: 4,
          total: 15800,
          status: "Completed",
        },
        {
          id: "5",
          orderNumber: "#ORD-12349",
          customer: {
            name: "Michael Wilson",
            email: "michael@example.com",
          },
          date: "2023-07-12",
          items: 1,
          total: 3600,
          status: "Cancelled",
        },
        {
          id: "6",
          orderNumber: "#ORD-12350",
          customer: {
            name: "Sarah Brown",
            email: "sarah@example.com",
          },
          date: "2023-07-12",
          items: 2,
          total: 9300,
          status: "Processing",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    // Simulate deleting an order
    setOrders(orders.filter((order) => order.id !== id))
    toast({
      title: "Order deleted",
      description: "The order has been deleted successfully.",
    })
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and track your customer orders</p>
        </div>
        <Button onClick={() => router.push("/orders/new")} className="gap-1">
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" /> All Statuses
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery("")}>All Statuses</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Processing")}>Processing</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("On Hold")}>On Hold</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Cancelled")}>Cancelled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-1 sm:w-[150px]">
          <Filter className="h-4 w-4" /> More Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>ITEMS</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>₹{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : order.status === "On Hold"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/orders/${order.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/orders/${order.id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t find any orders matching your search.</p>
          <Button onClick={() => setSearchQuery("")} variant="link" className="mt-4">
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
}

