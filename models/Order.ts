import mongoose, { type Document, type Model, Schema, type Types } from "mongoose"

interface OrderItem {
  product: Types.ObjectId
  name: string
  price: number
  quantity: number
}

interface ShippingAddress {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Customer {
  name: string
  email: string
  phone?: string
}

export interface IOrder extends Document {
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  totalAmount: number
  status: "Processing" | "Completed" | "Cancelled" | "On Hold"
  shippingAddress?: ShippingAddress
  paymentMethod: string
  paymentStatus: "Pending" | "Paid" | "Failed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Cancelled", "On Hold"],
      default: "Processing",
    },
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Generate order number before saving
OrderSchema.pre<IOrder>("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments()
    this.orderNumber = `#ORD-${(count + 12345).toString().padStart(5, "0")}`
  }
  next()
})

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order

