import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department")
    const search = searchParams.get("search")

    let query = {}

    if (department) {
      query = { ...query, department }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { position: { $regex: search, $options: "i" } },
        ],
      }
    }

    const employees = await User.find(query).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({ employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
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
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string
    const department = formData.get("department") as string
    const position = formData.get("position") as string
    const phone = formData.get("phone") as string

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageUrl = ""

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`
      const imageData = await uploadImage(base64Image)
      imageUrl = imageData.url
    }

    // Create new employee
    const employee = await User.create({
      name,
      email,
      password,
      role: role || "employee",
      department,
      position,
      phone,
      image: imageUrl,
    })

    return NextResponse.json(
      {
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
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}

