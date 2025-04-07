"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  transactionId: string
  date: string
  description: string
  amount: number
  type: "Credit" | "Debit"
  status: "Completed" | "Pending" | "Failed"
  account: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching transactions
    const timer = setTimeout(() => {
      setTransactions([
        {
          id: "1",
          transactionId: "TXN-12345",
          date: "2023-07-15",
          description: "Payment received for Order #12345",
          amount: 12500,
          type: "Credit",
          status: "Completed",
          account: "Bank Account",
        },
        {
          id: "2",
          transactionId: "TXN-12346",
          date: "2023-07-14",
          description: "Supplier payment for inventory",
          amount: 45000,
          type: "Debit",
          status: "Completed",
          account: "Bank Account",
        },
        {
          id: "3",
          transactionId: "TXN-12347",
          date: "2023-07-14",
          description: "Payment received for Order #12346",
          amount: 8750,
          type: "Credit",
          status: "Completed",
          account: "Bank Account",
        },
        {
          id: "4",
          transactionId: "TXN-12348",
          date: "2023-07-13",
          description: "Refund for Order #12340",
          amount: 3200,
          type: "Debit",
          status: "Completed",
          account: "Bank Account",
        },
        {
          id: "5",
          transactionId: "TXN-12349",
          date: "2023-07-12",
          description: "Payment for Order #12349",
          amount: 3600,
          type: "Credit",
          status: "Failed",
          account: "Credit Card",
        },
        {
          id: "6",
          transactionId: "TXN-12350",
          date: "2023-07-12",
          description: "Payment received for Order #12347",
          amount: 5200,
          type: "Credit",
          status: "Pending",
          account: "Bank Account",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    // Simulate deleting a transaction
    setTransactions(transactions.filter((transaction) => transaction.id !== id))
    toast({
      title: "Transaction deleted",
      description: "The transaction has been deleted successfully.",
    })
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate totals
  const totalCredit = filteredTransactions
    .filter((t) => t.type === "Credit" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebit = filteredTransactions
    .filter((t) => t.type === "Debit" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Manage and track your financial transactions</p>
        </div>
        <Button onClick={() => router.push("/transactions/new")} className="gap-1">
          <Plus className="h-4 w-4" /> New Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-muted-foreground">Total Income</h3>
          </div>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-2xl font-bold">₹{totalCredit.toLocaleString()}</p>
          )}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-muted-foreground">Total Expenses</h3>
          </div>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-2xl font-bold">₹{totalDebit.toLocaleString()}</p>
          )}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-muted-foreground">Net Balance</h3>
          </div>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-2xl font-bold">₹{(totalCredit - totalDebit).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" /> All Types
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery("")}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Credit")}>Credit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Debit")}>Debit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 sm:w-[150px]">
              <Filter className="h-4 w-4" /> All Statuses
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSearchQuery("")}>All Statuses</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery("Failed")}>Failed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TRANSACTION ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="font-medium">₹{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.type === "Credit"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {transaction.type === "Credit" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3" />
                        )}
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : transaction.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {transaction.status}
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
                            onClick={() => router.push(`/transactions/${transaction.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction.id)}
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

      {!isLoading && filteredTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No transactions found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find any transactions matching your search.
          </p>
          <Button onClick={() => setSearchQuery("")} variant="link" className="mt-4">
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
}

