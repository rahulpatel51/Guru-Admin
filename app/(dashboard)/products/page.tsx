"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Package, Search, Filter, Plus, MoreVertical, Eye, Edit, Trash } from "lucide-react"
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
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  sku: string
  category: {
    _id: string
    name: string
  }
  price: number
  stock: number
  status: string
  images: Array<{
    url: string
    publicId: string
  }>
}

interface Category {
  _id: string
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      let url = "/api/products"
      const params = new URLSearchParams()

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      if (categoryFilter) {
        params.append("category", categoryFilter)
      }

      if (statusFilter) {
        params.append("status", statusFilter)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
  }, [searchQuery, categoryFilter, statusFilter])

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product")
      }

      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      })

      // Refresh the products list
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Inventory</h2>
          <p className="text-muted-foreground">Manage your product catalog and stock</p>
        </div>
        <Button onClick={() => router.push("/products/add")} className="gap-1">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, SKU or description..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" />
              {statusFilter ? statusFilter : "All Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("In Stock")}>In Stock</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Low Stock")}>Low Stock</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Out of Stock")}>Out of Stock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" />
              {categoryFilter ? categories.find((c) => c._id === categoryFilter)?.name || "Category" : "All Categories"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCategoryFilter("")}>All Categories</DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category._id} onClick={() => setCategoryFilter(category._id)}>
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-square rounded-t-lg" />
                <div className="p-6">
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="mb-4 h-3 w-1/2" />
                  <Skeleton className="mb-2 h-6 w-1/3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || categoryFilter || statusFilter
                ? "We couldn't find any products matching your search criteria."
                : "Get started by adding your first product."}
            </p>
            {searchQuery || categoryFilter || statusFilter ? (
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter("")
                  setStatusFilter("")
                }}
                variant="link"
                className="mt-4"
              >
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => router.push("/products/add")} className="mt-4 gap-1">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            )}
          </div>
        ) : (
          products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-0">
                <div className="aspect-square bg-muted flex items-center justify-center rounded-t-lg">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url || "/placeholder.svg"}
                      alt={product.name}
                      className="aspect-square object-cover rounded-t-lg"
                    />
                  ) : (
                    <Package className="h-24 w-24 text-muted-foreground/50" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category?.name}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${product._id}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${product._id}/edit`)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(product._id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{formatCurrency(product.price)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/products/${product._id}`)}
                    >
                      View
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => router.push(`/products/${product._id}/edit`)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
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

