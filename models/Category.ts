import mongoose, { type Document, type Model, Schema } from "mongoose"

export interface ICategory extends Document {
  name: string
  description?: string
  slug: string
  image?: {
    url: string
    publicId: string
  }
  parentCategory?: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Generate slug before saving if not provided
CategorySchema.pre<ICategory>("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  next()
})

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

export default Category

