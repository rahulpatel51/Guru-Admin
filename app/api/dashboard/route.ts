import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/models/Product"
import Order from "@/models/Order"
import User from "@/models/User"
import Transaction from "@/models/Transaction"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "month"

    // Get current date
    const now = new Date()

    // Calculate date range based on period
    const startDate = new Date()
    if (period === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === "quarter") {
      startDate.setMonth(now.getMonth() - 3)
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Calculate previous period for growth calculation
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(now)
    if (period === "week") {
      previousStartDate.setDate(previousStartDate.getDate() - 7)
      previousEndDate.setDate(previousEndDate.getDate() - 7)
    } else if (period === "month") {
      previousStartDate.setMonth(previousStartDate.getMonth() - 1)
      previousEndDate.setMonth(previousEndDate.getMonth() - 1)
    } else if (period === "quarter") {
      previousStartDate.setMonth(previousStartDate.getMonth() - 3)
      previousEndDate.setMonth(previousEndDate.getMonth() - 3)
    } else if (period === "year") {
      previousStartDate.setFullYear(previousStartDate.getFullYear() - 1)
      previousEndDate.setFullYear(previousEndDate.getFullYear() - 1)
    }

    // Get counts and totals
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      previousTotalOrders,
      previousTotalRevenue,
      recentOrders,
      recentTransactions,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: now } }),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: now } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: previousStartDate, $lte: previousEndDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lte: previousEndDate } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Transaction.find().sort({ createdAt: -1 }).limit(5),
    ])

    // Calculate growth percentages
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0
    const previousRevenue = previousTotalRevenue.length > 0 ? previousTotalRevenue[0].total : 0

    const revenueGrowth =
      previousRevenue === 0
        ? 100
        : Number.parseFloat((((revenue - previousRevenue) / previousRevenue) * 100).toFixed(1))

    const ordersGrowth =
      previousTotalOrders === 0
        ? 100
        : Number.parseFloat((((totalOrders - previousTotalOrders) / previousTotalOrders) * 100).toFixed(1))

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSales: 1,
          totalRevenue: 1,
          category: { $arrayElemAt: ["$productDetails.category", 0] },
        },
      },
    ])

    // Format recent activities
    const recentActivities = [
      ...recentOrders.map((order) => ({
        id: order._id.toString(),
        title: "New order received",
        description: `Order ${order.orderNumber} from ${order.customer.name}`,
        timestamp: order.createdAt,
        type: "order",
      })),
      ...recentTransactions.map((transaction) => ({
        id: transaction._id.toString(),
        title: transaction.type === "Credit" ? "Payment received" : "Payment made",
        description: transaction.description,
        timestamp: transaction.createdAt,
        type: "payment",
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)

    return NextResponse.json({
      totalRevenue: revenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueGrowth,
      ordersGrowth,
      productsGrowth: 0, // This would require more complex calculation
      customersGrowth: 0, // This would require more complex calculation
      recentActivities,
      topProducts: topProducts.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        category: product.category || "Uncategorized",
        sales: product.totalSales,
        revenue: product.totalRevenue,
      })),
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

