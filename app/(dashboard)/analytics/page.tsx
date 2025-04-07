"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { ArrowUp, ArrowDown, RefreshCw, Calendar } from "lucide-react"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Track your business performance and growth</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={period} onValueChange={handlePeriodChange} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue" value="₹24,78,000" change={12.5} period={period} isLoading={isLoading} />
        <MetricCard title="Total Orders" value="1,245" change={8.2} period={period} isLoading={isLoading} />
        <MetricCard title="Average Order Value" value="₹1,990" change={-3.1} period={period} isLoading={isLoading} />
        <MetricCard title="Conversion Rate" value="3.2%" change={0.8} period={period} isLoading={isLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              {period === "week"
                ? "Daily revenue for the current week"
                : period === "month"
                  ? "Weekly revenue for the current month"
                  : period === "quarter"
                    ? "Monthly revenue for the current quarter"
                    : "Quarterly revenue for the current year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
            <CardDescription>
              {period === "week"
                ? "Daily orders for the current week"
                : period === "month"
                  ? "Weekly orders for the current month"
                  : period === "quarter"
                    ? "Monthly orders for the current quarter"
                    : "Quarterly orders for the current year"}
            </CardDescription>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with the highest sales volume</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" /> {period}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                      <Skeleton className="h-3 w-12 ml-auto mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <ProductItem
                    name="Premium Wireless Headphones"
                    category="Electronics"
                    sales={120}
                    revenue={1079880}
                  />
                  <ProductItem name="Organic Cotton T-Shirt" category="Clothing" sales={95} revenue={123405} />
                  <ProductItem
                    name="Stainless Steel Water Bottle"
                    category="Home & Kitchen"
                    sales={85}
                    revenue={76415}
                  />
                  <ProductItem name="Leather Wallet" category="Accessories" sales={78} revenue={116922} />
                  <ProductItem name="Wireless Charging Pad" category="Electronics" sales={65} revenue={58435} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  period,
  isLoading,
}: {
  title: string
  value: string
  change: number
  period: string
  isLoading: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? <Skeleton className="h-7 w-24" /> : <p className="text-2xl font-bold">{value}</p>}
          <div className="flex items-center gap-1">
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <>
                {change > 0 ? (
                  <div className="flex items-center text-green-500 text-xs">
                    <ArrowUp className="h-3 w-3" />
                    {change}%
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 text-xs">
                    <ArrowDown className="h-3 w-3" />
                    {Math.abs(change)}%
                  </div>
                )}
                <p className="text-xs text-muted-foreground">vs last {period}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductItem({
  name,
  category,
  sales,
  revenue,
}: {
  name: string
  category: string
  sales: number
  revenue: number
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
        <span className="text-lg font-bold">{name.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{name}</h4>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">₹{revenue.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{sales} units sold</p>
      </div>
    </div>
  )
}

