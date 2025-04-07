import mongoose, { type Document, type Model, Schema } from "mongoose"

interface ProductImage {
  url: string
  publicId: string
}

export interface IProduct extends Document {
  name: string
  sku: string
  description?: string
  price: number
  category: mongoose.Types.ObjectId
  stock: number
  images: ProductImage[]
  status: "In Stock" | "Low Stock" | "Out of Stock"
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    sku: {
      type: String,
      required: [true, "Please provide a SKU"],
      unique: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a category"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  },
)

// Update status based on stock
ProductSchema.pre<IProduct>("save", function (next) {
  if (this.stock <= 0) {
    this.status = "Out of Stock"
  } else if (this.stock <= 10) {
    this.status = "Low Stock"
  } else {
    this.status = "In Stock"
  }
  next()
})

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product

