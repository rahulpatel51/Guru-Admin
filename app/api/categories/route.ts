import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Category from "@/models/Category"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const parentId = searchParams.get("parentId")
    const isActive = searchParams.get("isActive")

    let query: any = {}

    if (search) {
      query = {
        ...query,
        $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
      }
    }

    if (parentId) {
      query.parentCategory = parentId === "null" ? null : parentId
    }

    if (isActive) {
      query.isActive = isActive === "true"
    }

    const categories = await Category.find(query).populate("parentCategory", "name").sort({ createdAt: -1 })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
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
    const description = formData.get("description") as string
    const slug = formData.get("slug") as string
    const parentCategory = formData.get("parentCategory") as string
    const isActive = formData.get("isActive") === "true"

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageData = null

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      imageData = await uploadImage(base64Image)
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      slug: slug || undefined, // Will be auto-generated if not provided
      parentCategory: parentCategory || undefined,
      isActive,
      image: imageData,
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

