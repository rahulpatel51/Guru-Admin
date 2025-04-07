import { uploadImage } from "./cloudinary"

export async function handleImageUpload(file: File) {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file)

    // Upload to Cloudinary
    const result = await uploadImage(base64)

    return result
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

