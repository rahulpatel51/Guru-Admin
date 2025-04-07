"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Trash, Folder, Calendar, Tag, CheckCircle, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image?: {
    url: string
    publicId: string
  }
  parentCategory?: {
    _id: string
    name: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CategoryDetailsPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch category")
        }
        const data = await response.json()
        setCategory(data.category)
      } catch (error) {
        console.error("Error fetching category:", error)
        toast({
          title: "Error",
          description: "Failed to load category. Please try again.",
          variant: "destructive",
        })
        router.push("/categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, router, toast])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category")
      }

      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      })

      router.push("/categories")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Skeleton className="h-48 w-48 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Category not found</h2>
          <p className="text-muted-foreground">The category you are looking for does not exist.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/categories")}>
            Go back to categories
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/categories/${params.id}/edit`)} className="gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="gap-1">
            <Trash className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>View the details of this category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{category.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="font-mono text-sm">{category.slug}</p>
              </div>
            </div>

            {category.description && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{category.description}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Parent Category</p>
              {category.parentCategory ? (
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => router.push(`/categories/${category.parentCategory?._id}`)}
                  >
                    {category.parentCategory.name}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">None (Top Level Category)</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                {category.isActive ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-green-500">Active</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-red-500">Inactive</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{formatDate(category.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Category Image</CardTitle>
            <CardDescription>Preview of the category image</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {category.image ? (
              <img
                src={category.image.url || "/placeholder.svg"}
                alt={category.name}
                className="max-h-64 rounded-md object-contain"
              />
            ) : (
              <div className="flex h-48 w-48 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 p-4">
                <Folder className="mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">No image available for this category</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/categories")}>
              Back to Categories
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

