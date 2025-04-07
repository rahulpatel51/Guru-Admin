"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { ArrowUp, ArrowDown, DollarSign, Package, ShoppingCart, Users, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  customersGrowth: number
  recentActivities: Array<{
    id: string
    title: string
    description: string
    timestamp: string
    type: string
  }>
  topProducts: Array<{
    id: string
    name: string
    category: string
    sales: number
    revenue: number
  }>
}

interface ActivityItemProps {
  title: string
  description: string
  timestamp: string
  isLoading: boolean
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  isLoading: boolean
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState("month")
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/dashboard?period=${period}`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }

  const refreshData = () => {
    fetchDashboardData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex gap-2">
          <Tabs value={period} onValueChange={handlePeriodChange} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={refreshData} variant="outline" size="icon" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={isLoading || !dashboardData ? "..." : `₹${(dashboardData.totalRevenue).toLocaleString()}`}
          change={dashboardData?.revenueGrowth || 0}
          icon={DollarSign}
          isLoading={isLoading}
          period={period}
        />
        <MetricCard
          title="Total Orders"
          value={isLoading || !dashboardData ? "..." : dashboardData.totalOrders.toLocaleString()}
          change={dashboardData?.ordersGrowth || 0}
          icon={ShoppingCart}
          isLoading={isLoading}
          period={period}
        />
        <MetricCard
          title="Total Products"
          value={isLoading || !dashboardData ? "..." : dashboardData.totalProducts.toLocaleString()}
          change={dashboardData?.productsGrowth || 0}
          icon={Package}
          isLoading={isLoading}
          period={period}
        />
        <MetricCard
          title="Total Customers"
          value={isLoading || !dashboardData ? "..." : dashboardData.totalCustomers.toLocaleString()}
          change={dashboardData?.customersGrowth || 0}
          icon={Users}
          isLoading={isLoading}
          period={period}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales Statistics</CardTitle>
            <CardDescription>Daily sales for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                  dashboardData.recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                      isLoading={isLoading}
                    />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent activities found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="orders" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : dashboardData?.recentActivities ? (
                  dashboardData.recentActivities
                    .filter((activity) => activity.type === "order")
                    .map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        title={activity.title}
                        description={activity.description}
                        timestamp={activity.timestamp}
                        isLoading={isLoading}
                      />
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent order activities found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="payments" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : dashboardData?.recentActivities ? (
                  dashboardData.recentActivities
                    .filter((activity) => activity.type === "payment")
                    .map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        title={activity.title}
                        description={activity.description}
                        timestamp={activity.timestamp}
                        isLoading={isLoading}
                      />
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent payment activities found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon: Icon, isLoading, period }: MetricCardProps & { period: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="mt-1 h-7 w-24 animate-pulse rounded bg-muted"></div>
            ) : (
              <p className="mt-1 text-2xl font-bold">{value}</p>
            )}
            {isLoading ? (
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-muted"></div>
            ) : (
              <div className="flex items-center gap-1 text-xs">
                {change > 0 ? (
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3" />
                    {change}%
                  </div>
                ) : change < 0 ? (
                  <div className="flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3" />
                    {Math.abs(change)}%
                  </div>
                ) : (
                  <div className="text-muted-foreground">0%</div>
                )}
                <p className="text-muted-foreground">vs last {period}</p>
              </div>
            )}
          </div>
          <div className="rounded-full bg-primary/20 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, description, timestamp, isLoading }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-3">
      {isLoading ? (
        <>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            <div className="h-3 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-3 w-16 animate-pulse rounded bg-muted"></div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full bg-primary/20 p-2">
            <RefreshCw className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </>
      )}
    </div>
  )
}

