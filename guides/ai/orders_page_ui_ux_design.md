# Code for Enhanced Orders Page with RTK Query

This file contains the complete code for the redesigned `app/(protected)/orders/page.tsx`. It implements the advanced filtering, search, and table layout as specified in the UI/UX design, using **RTK Query** for live data fetching.

**Note:** This implementation assumes you are using **Shadcn/UI** for components and have an existing RTK Query slice for orders (`ordersApi`).

## `app/(protected)/orders/page.tsx`

```tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  ChevronDown,
  Search,
  Calendar as CalendarIcon,
  PlusCircle,
  Loader2,
} from "lucide-react";

// --- Shadcn/UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// --- RTK Query Hook & Types ---
// Make sure this path is correct for your project structure
import { useGetOrdersQuery } from "@/lib/redux/services/ordersApi"; 
import type { Order, OrderStatus, PaymentStatus, OrderSource } from "@/lib/redux/services/ordersApi"; // Assuming types are exported from your API slice

// --- Helper Components & Functions ---

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ["paid", "pending", "refunded"];
const SOURCE_OPTIONS: OrderSource[] = ["manual", "facebook", "whatsapp"];

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "delivered": return "success";
    case "processing":
    case "shipped": return "info";
    case "pending": return "warning";
    case "cancelled": return "destructive";
    default: return "default";
  }
};

const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "refunded": return "destructive";
      default: return "default";
    }
  };

// --- Main Page Component ---

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State Management for Filters from URL ---
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [statusFilter, setStatusFilter] = useState<string[]>(searchParams.getAll("status") || []);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string[]>(searchParams.getAll("payment") || []);
  const [sourceFilter, setSourceFilter] = useState<string[]>(searchParams.getAll("source") || []);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // --- Effect to Update URL on Filter Change ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set("q", debouncedSearchQuery);
    if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    statusFilter.forEach(s => params.append("status", s));
    paymentStatusFilter.forEach(p => params.append("payment", p));
    sourceFilter.forEach(s => params.append("source", s));
    
    // Using replace to avoid polluting browser history
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, dateRange, statusFilter, paymentStatusFilter, sourceFilter, pathname, router]);

  // --- Data Fetching with RTK Query ---
  const queryParams = useMemo(() => ({
    q: debouncedSearchQuery,
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    status: statusFilter,
    payment: paymentStatusFilter,
    source: sourceFilter,
  }), [debouncedSearchQuery, dateRange, statusFilter, paymentStatusFilter, sourceFilter]);

  const { data: orders = [], isLoading, isError, error } = useGetOrdersQuery(queryParams);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button onClick={() => router.push('/orders/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Order
        </Button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by Order # or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Advanced Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Filter <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Order Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={(checked) => {
                  setStatusFilter(prev => checked ? [...prev, status] : prev.filter(s => s !== status))
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PAYMENT_STATUS_OPTIONS.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={paymentStatusFilter.includes(status)}
                onCheckedChange={(checked) => {
                  setPaymentStatusFilter(prev => checked ? [...prev, status] : prev.filter(s => s !== status))
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuLabel>Source</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SOURCE_OPTIONS.map(source => (
              <DropdownMenuCheckboxItem
                key={source}
                checked={sourceFilter.includes(source)}
                onCheckedChange={(checked) => {
                  setSourceFilter(prev => checked ? [...prev, source] : prev.filter(s => s !== source))
                }}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 3. Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Checkbox /></TableHead>
              <TableHead className="w-[120px]">Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Payment</TableHead>
              <TableHead className="w-[120px]">Source</TableHead>
              <TableHead className="text-right w-[120px]">Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-red-500">
                  Error fetching orders. Please try again.
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={9} className="text-center h-24">
                        No orders found.
                    </TableCell>
                </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} onClick={() => router.push(`/orders/${order.id}`)} className="cursor-pointer">
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox /></TableCell>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "LLL dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>
                          {order.payment_status}
                      </Badge>
                  </TableCell>
                  <TableCell>{order.source}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/orders/${order.id}`); }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* 4. Pagination would go here */}
    </div>
  );
}