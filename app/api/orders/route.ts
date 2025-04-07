import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = {}

    if (status) {
      query = { ...query, status }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { orderNumber: { $regex: search, $options: "i" } },
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.email": { $regex: search, $options: "i" } },
        ],
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate("items.product", "name price")

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { customer, items, shippingAddress, paymentMethod, notes } = await req.json()

    // Validate input
    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total amount and update product stock
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return NextResponse.json({ error: `Product with ID ${item.product} not found` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 })
      }

      // Update product stock
      product.stock -= item.quantity
      await product.save()

      // Calculate item total
      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      })
    }

    // Create order
    const order = await Order.create({
      customer,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

