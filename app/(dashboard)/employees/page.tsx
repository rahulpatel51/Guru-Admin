"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash, User } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  joinDate: string
  status: "Active" | "On Leave" | "Inactive"
  image?: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching employees
    const timer = setTimeout(() => {
      setEmployees([
        {
          id: "1",
          name: "John Doe",
          email: "john@adminhub.com",
          position: "Senior Developer",
          department: "Engineering",
          joinDate: "2021-05-12",
          status: "Active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@adminhub.com",
          position: "Product Manager",
          department: "Product",
          joinDate: "2021-06-15",
          status: "Active",
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "robert@adminhub.com",
          position: "UI/UX Designer",
          department: "Design",
          joinDate: "2021-07-10",
          status: "On Leave",
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily@adminhub.com",
          position: "Marketing Specialist",
          department: "Marketing",
          joinDate: "2021-08-05",
          status: "Active",
        },
        {
          id: "5",
          name: "Michael Wilson",
          email: "michael@adminhub.com",
          position: "Customer Support",
          department: "Support",
          joinDate: "2021-09-20",
          status: "Inactive",
        },
        {
          id: "6",
          name: "Sarah Brown",
          email: "sarah@adminhub.com",
          position: "HR Manager",
          department: "Human Resources",
          joinDate: "2021-10-15",
          status: "Active",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    // Simulate deleting an employee
    setEmployees(employees.filter((employee) => employee.id !== id))
    toast({
      title: "Employee deleted",
      description: "The employee has been deleted successfully.",
    })
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => router.push("/employees/add")} className="gap-1">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" /> All Statuses
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery("")}>All Statuses</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("On Leave")}>On Leave</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Inactive")}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" /> All Departments
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery("")}>All Departments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Engineering")}>Engineering</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Product")}>Product</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Design")}>Design</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Marketing")}>Marketing</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Support")}>Support</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Human Resources")}>Human Resources</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>EMPLOYEE</TableHead>
              <TableHead>POSITION</TableHead>
              <TableHead>DEPARTMENT</TableHead>
              <TableHead>JOIN DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {employee.image ? (
                            <img
                              src={employee.image || "/placeholder.svg"}
                              alt={employee.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : employee.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/employees/${employee.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/employees/${employee.id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(employee.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find any employees matching your search.
          </p>
          <Button onClick={() => setSearchQuery("")} variant="link" className="mt-4">
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
}

