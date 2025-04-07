import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const order = await Order.findById(params.id).populate("items.product", "name price images")

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { status, paymentStatus } = await req.json()

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Handle status change
    if (status && status !== order.status) {
      // If cancelling an order, restore product stock
      if (status === "Cancelled" && order.status !== "Cancelled") {
        for (const item of order.items) {
          const product = await Product.findById(item.product)
          if (product) {
            product.stock += item.quantity
            await product.save()
          }
        }
      }

      // If un-cancelling an order, reduce product stock again
      if (order.status === "Cancelled" && status !== "Cancelled") {
        for (const item of order.items) {
          const product = await Product.findById(item.product)
          if (product) {
            product.stock -= item.quantity
            await product.save()
          }
        }
      }

      order.status = status
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    await order.save()

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

