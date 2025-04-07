import multer from "multer"
import { NextResponse } from "next/server"
import type { NextApiRequest, NextApiResponse } from "next"

// Configure storage
const storage = multer.memoryStorage()

// Configure file filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false)
  }
  cb(null, true)
}

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
})

// Middleware to handle file uploads
export const uploadMiddleware = (fieldName: string) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      const multerUpload = upload.single(fieldName)

      await new Promise<void>((resolve, reject) => {
        multerUpload(req as any, res as any, (err: any) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })

      next()
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Error uploading file" },
        { status: 400 },
      )
    }
  }
}

