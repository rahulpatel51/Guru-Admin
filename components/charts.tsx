"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartProps {
  isLoading: boolean
}

export function LineChart({ isLoading }: ChartProps) {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Sample data for revenue and profit
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const revenue = [400000, 200000, 500000, 400000, 600000, 550000, 700000, 650000, 750000, 800000, 900000, 950000]
  const profit = [200000, 100000, 300000, 250000, 350000, 400000, 450000, 400000, 500000, 550000, 600000, 650000]

  // Find max value for y-axis
  const maxValue = Math.max(...revenue, ...profit)
  const yAxisMax = Math.ceil(maxValue / 100000) * 100000

  return (
    <div className="h-[300px] w-full">
      <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
        {/* Y-axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = (yAxisMax / 5) * (5 - i)
          return (
            <text
              key={i}
              x="40"
              y={i * 50 + 25}
              fontSize="12"
              textAnchor="end"
              fill="currentColor"
              className="text-muted-foreground"
            >
              ₹{(value / 100000).toFixed(0)}L
            </text>
          )
        })}

        {/* X-axis labels */}
        {months.map((month, i) => (
          <text
            key={i}
            x={70 + (i * 700) / 11}
            y="280"
            fontSize="12"
            textAnchor="middle"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {month}
          </text>
        ))}

        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1="60"
            y1={i * 50 + 25}
            x2="780"
            y2={i * 50 + 25}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="text-muted"
          />
        ))}

        {/* Revenue line */}
        <path
          d={`M ${70} ${250 - (revenue[0] / yAxisMax) * 250} ${revenue
            .map((val, i) => `L ${70 + (i * 700) / 11} ${250 - (val / yAxisMax) * 250}`)
            .join(" ")}`}
          fill="none"
          stroke="#00bcd4"
          strokeWidth="3"
        />

        {/* Revenue points */}
        {revenue.map((val, i) => (
          <circle key={i} cx={70 + (i * 700) / 11} cy={250 - (val / yAxisMax) * 250} r="4" fill="#00bcd4" />
        ))}

        {/* Profit line */}
        <path
          d={`M ${70} ${250 - (profit[0] / yAxisMax) * 250} ${profit
            .map((val, i) => `L ${70 + (i * 700) / 11} ${250 - (val / yAxisMax) * 250}`)
            .join(" ")}`}
          fill="none"
          stroke="#2196f3"
          strokeWidth="3"
        />

        {/* Profit points */}
        {profit.map((val, i) => (
          <circle key={i} cx={70 + (i * 700) / 11} cy={250 - (val / yAxisMax) * 250} r="4" fill="#2196f3" />
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#00bcd4]"></div>
          <span className="text-sm">Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#2196f3]"></div>
          <span className="text-sm">Profit</span>
        </div>
      </div>
    </div>
  )
}

export function BarChart({ isLoading }: ChartProps) {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Sample data for daily sales
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const sales = [120, 180, 150, 160, 230, 280, 190]

  // Find max value for y-axis
  const maxValue = Math.max(...sales)
  const yAxisMax = Math.ceil(maxValue / 50) * 50

  return (
    <div className="h-[300px] w-full">
      <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
        {/* Y-axis labels */}
        {Array.from({ length: 7 }, (_, i) => {
          const value = (yAxisMax / 6) * (6 - i)
          return (
            <text
              key={i}
              x="40"
              y={i * 40 + 25}
              fontSize="12"
              textAnchor="end"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {value}
            </text>
          )
        })}

        {/* X-axis labels */}
        {days.map((day, i) => (
          <text
            key={i}
            x={100 + i * 100}
            y="280"
            fontSize="12"
            textAnchor="middle"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {day}
          </text>
        ))}

        {/* Grid lines */}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={i}
            x1="60"
            y1={i * 40 + 25}
            x2="780"
            y2={i * 40 + 25}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="text-muted"
          />
        ))}

        {/* Bars */}
        {sales.map((sale, i) => (
          <rect
            key={i}
            x={80 + i * 100}
            y={250 - (sale / yAxisMax) * 250}
            width="40"
            height={(sale / yAxisMax) * 250}
            fill="#00bcd4"
            rx="4"
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#00bcd4]"></div>
          <span className="text-sm">Sales</span>
        </div>
      </div>
    </div>
  )
}

export function PieChart({ isLoading }: ChartProps) {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Sample data for sales by category
  const categories = [
    { name: "Electronics", value: 35, color: "#00bcd4" },
    { name: "Clothing", value: 25, color: "#2196f3" },
    { name: "Home & Kitchen", value: 20, color: "#9c27b0" },
    { name: "Accessories", value: 15, color: "#ff9800" },
    { name: "Others", value: 5, color: "#f44336" },
  ]

  // Calculate total
  const total = categories.reduce((sum, category) => sum + category.value, 0)

  // Calculate pie slices
  let startAngle = 0
  const slices = categories.map((category) => {
    const angle = (category.value / total) * 360
    const slice = {
      startAngle,
      endAngle: startAngle + angle,
      color: category.color,
      name: category.name,
      value: category.value,
    }
    startAngle += angle
    return slice
  })

  // Function to convert angle to coordinates on the circle
  const angleToCoordinates = (angle: number, radius: number) => {
    const radians = ((angle - 90) * Math.PI) / 180
    return {
      x: 150 + radius * Math.cos(radians),
      y: 150 + radius * Math.sin(radians),
    }
  }

  // Generate SVG path for each slice
  const generatePath = (slice: (typeof slices)[0]) => {
    const start = angleToCoordinates(slice.startAngle, 100)
    const end = angleToCoordinates(slice.endAngle, 100)
    const largeArcFlag = slice.endAngle - slice.startAngle <= 180 ? "0" : "1"
    return `M 150 150 L ${start.x} ${start.y} A 100 100 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
  }

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-full items-center justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {slices.map((slice, i) => (
            <path key={i} d={generatePath(slice)} fill={slice.color} stroke="white" strokeWidth="2" />
          ))}
        </svg>
        <div className="ml-4 space-y-2">
          {categories.map((category, i) => (
            <div key={i} className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
              <span className="text-sm">
                {category.name} ({category.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

