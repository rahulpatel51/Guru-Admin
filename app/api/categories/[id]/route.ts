import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Category from "@/models/Category"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const category = await Category.findById(params.id).populate("parentCategory", "name")

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Find the category
    const category = await Category.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageData = category.image

    if (imageFile) {
      // Delete old image if exists
      if (category.image && category.image.publicId) {
        await deleteImage(category.image.publicId)
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      imageData = await uploadImage(base64Image)
    }

    // Update category
    category.name = name || category.name
    category.description = description
    category.slug = slug || category.slug
    category.parentCategory = parentCategory || undefined
    category.isActive = isActive
    category.image = imageData

    await category.save()

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const category = await Category.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category has products
    const Product = (await import("@/models/Product")).default
    const productsCount = await Product.countDocuments({ category: params.id })

    if (productsCount > 0) {
      return NextResponse.json({ error: "Cannot delete category with associated products" }, { status: 400 })
    }

    // Delete image from Cloudinary
    if (category.image && category.image.publicId) {
      await deleteImage(category.image.publicId)
    }

    await Category.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

