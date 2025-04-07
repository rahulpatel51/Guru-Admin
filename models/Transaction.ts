import mongoose, { type Document, type Model, Schema, type Types } from "mongoose"

export interface ITransaction extends Document {
  transactionId: string
  description: string
  amount: number
  type: "Credit" | "Debit"
  status: "Completed" | "Pending" | "Failed"
  account: string
  relatedTo?: Types.ObjectId
  relatedModel?: "Order" | "User" | "Product"
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      default: "Completed",
    },
    account: {
      type: String,
      required: true,
    },
    relatedTo: {
      type: Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Order", "User", "Product"],
    },
  },
  {
    timestamps: true,
  },
)

// Generate transaction ID before saving
TransactionSchema.pre<ITransaction>("save", async function (next) {
  if (!this.transactionId) {
    const count = await mongoose.models.Transaction.countDocuments()
    this.transactionId = `TXN-${(count + 12345).toString().padStart(5, "0")}`
  }
  next()
})

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)

export default Transaction

