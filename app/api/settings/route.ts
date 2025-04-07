import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import mongoose from "mongoose"

// Define Settings Schema
const SettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "AdminHub Store",
    },
    storeEmail: {
      type: String,
      default: "store@adminhub.com",
    },
    storePhone: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "USD",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    dateFormat: {
      type: String,
      default: "MM/DD/YYYY",
    },
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "dark",
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Create or get the Settings model
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get settings or create default if not exists
    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create({})
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const updates = await req.json()

    // Get settings or create default if not exists
    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create(updates)
    } else {
      // Update settings
      Object.keys(updates).forEach((key) => {
        settings[key] = updates[key]
      })

      await settings.save()
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

