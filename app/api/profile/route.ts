import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const phone = formData.get("phone") as string

    // Find the user
    const user = await User.findById(session.user.id).select("+password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageUrl = user.image

    if (imageFile) {
      // Extract public ID from the current image URL if it exists
      if (user.image) {
        const publicId = user.image.split("/").pop()?.split(".")[0]
        if (publicId) {
          await deleteImage(`adminhub/${publicId}`)
        }
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      const imageData = await uploadImage(base64Image)
      imageUrl = imageData.url
    }

    // Update user
    user.name = name || user.name
    user.phone = phone || user.phone
    user.image = imageUrl

    // Update email if changed and not already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
      user.email = email
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    await user.save()

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        image: user.image,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

