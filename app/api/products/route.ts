import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/models/Product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    let query: any = {}

    if (category) {
      query = { ...query, category }
    }

    if (status) {
      query = { ...query, status }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    }

    const totalProducts = await Product.countDocuments(query)
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const formData = await req.formData()
    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const stock = Number.parseInt(formData.get("stock") as string)

    // Validate input
    if (!name || !sku || !category || isNaN(price) || isNaN(stock)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku })
    if (existingProduct) {
      return NextResponse.json({ error: "Product with this SKU already exists" }, { status: 400 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageData = null

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      imageData = await uploadImage(base64Image)
    }

    const product = await Product.create({
      name,
      sku,
      description,
      price,
      category,
      stock,
      images: imageData ? [imageData] : [],
    })

    // Populate category information
    await product.populate("category", "name")

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

