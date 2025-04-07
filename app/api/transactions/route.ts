import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Transaction from "@/models/Transaction"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = {}

    if (type) {
      query = { ...query, type }
    }

    if (status) {
      query = { ...query, status }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { transactionId: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { account: { $regex: search, $options: "i" } },
        ],
      }
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { description, amount, type, account, relatedTo, relatedModel } = await req.json()

    // Validate input
    if (!description || !amount || !type || !account) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await Transaction.create({
      description,
      amount,
      type,
      account,
      relatedTo,
      relatedModel,
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

