
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, MessageSquare, PackageOpen, Facebook, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customer";




interface CustomersListProps {
  customers?: Customer[];
}

const CustomersList = ({ customers = [] }: CustomersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterChannel, setFilterChannel] = useState<"all" | "facebook" | "whatsapp" | "both">("all");

  const filteredCustomers = customers.filter(
    (customer) =>
      (filterStatus === "all" || customer.status === filterStatus) &&
      (filterChannel === "all" || customer.channel === filterChannel) &&
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       customer.phone.includes(searchTerm))
  );
  const router = useRouter();


    const handleAddCustomer = () => {
    router.push('/customers/create');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 w-full"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex gap-2 flex-1 md:flex-none">
            <Button
              size="sm"
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="flex-1"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "active" ? "default" : "outline"}
              onClick={() => setFilterStatus("active")}
              className="flex-1"
            >
              Active
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "inactive" ? "default" : "outline"}
              onClick={() => setFilterStatus("inactive")}
              className="flex-1"
            >
              Inactive
            </Button>
          </div>
          
          <Button onClick={handleAddCustomer}  className="flex cursor-pointer items-center gap-2 outline outline-amber-400">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={filterChannel === "all" ? "default" : "outline"}
          onClick={() => setFilterChannel("all")}
        >
          All Channels
        </Button>
        <Button
          size="sm"
          variant={filterChannel === "facebook" ? "default" : "outline"}
          onClick={() => setFilterChannel("facebook")}
          className="text-blue-600"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button
          size="sm"
          variant={filterChannel === "whatsapp" ? "default" : "outline"}
          onClick={() => setFilterChannel("whatsapp")}
          className="text-green-600"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        <Button
          size="sm"
          variant={filterChannel === "both" ? "default" : "outline"}
          onClick={() => setFilterChannel("both")}
        >
          Both Channels
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">No customers found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
              {(searchTerm || filterStatus !== "all" || filterChannel !== "all") && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterChannel("all");
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        )}
      </div>
    </div>
  );
};

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={customer.avatar} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{customer.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customer since {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PackageOpen className="h-4 w-4 mr-2" />
              View Orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Phone:</p>
            <p className="text-sm">{customer.phone}</p>
          </div>
            <div>
            <p className="text-xs text-muted-foreground">City:</p>
            <p className="text-sm">{customer.city}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Police Station:</p>
            <p className="text-sm">{customer.police_station}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Orders:</p>
            <p className="text-sm font-medium">{customer.orders_count}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent:</p>
            <p className="text-sm font-medium">
              {/* ${customer.totalSpent.toFixed(2)} */}
              ${customer.total_spent}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status:</p>
            <Badge variant={customer.status === "active" ? "default" : "outline"}>
              {customer.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        
        <div className="pt-4 mt-4 border-t flex justify-between">
          <div className="flex gap-2">
            {(customer.channel === "facebook" || customer.channel === "both") && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                <Facebook className="h-3 w-3 mr-1" />
                Facebook
              </Badge>
            )}
            {(customer.channel === "whatsapp" || customer.channel === "both") && (
              <Badge variant="outline" className="bg-green-50 text-green-600">
                <MessageSquare className="h-3 w-3 mr-1" />
                WhatsApp
              </Badge>
            )}
          </div>
          {customer.last_order_date && (
            <p className="text-xs text-muted-foreground">
              Last order: {customer.last_order_date}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersList;
