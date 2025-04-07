import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const employee = await User.findById(params.id).select("-password")

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({ employee })
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
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
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string
    const department = formData.get("department") as string
    const position = formData.get("position") as string
    const phone = formData.get("phone") as string

    // Find the employee
    const employee = await User.findById(params.id)

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageUrl = employee.image

    if (imageFile) {
      // Extract public ID from the current image URL if it exists
      if (employee.image) {
        const publicId = employee.image.split("/").pop()?.split(".")[0]
        if (publicId) {
          await deleteImage(`adminhub/${publicId}`)
        }
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      const imageData = await uploadImage(base64Image)
      imageUrl = imageData.url
    }

    // Update employee
    employee.name = name || employee.name
    employee.email = email || employee.email
    employee.role = role || employee.role
    employee.department = department || employee.department
    employee.position = position || employee.position
    employee.phone = phone || employee.phone
    employee.image = imageUrl

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10)
      employee.password = await bcrypt.hash(password, salt)
    }

    await employee.save()

    return NextResponse.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        phone: employee.phone,
        image: employee.image,
      },
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const employee = await User.findById(params.id)

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Delete image from Cloudinary if exists
    if (employee.image) {
      const publicId = employee.image.split("/").pop()?.split(".")[0]
      if (publicId) {
        await deleteImage(`adminhub/${publicId}`)
      }
    }

    await User.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}

