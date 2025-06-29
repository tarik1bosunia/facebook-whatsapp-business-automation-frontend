'use client'


import CustomersList from "@/features/customers/CustomersList";
import { useGetCustomersQuery } from "@/lib/redux/services/customerApi";

export default function Customers() {
  const { data: customers, isLoading, isError } = useGetCustomersQuery();

  // const [g] = useState<Customer[]>(
  //   [
  //   {
  //     id: "c1",
  //     name: "Sarah Wilson",
  //     email: "sarah.wilson@example.com",
  //     phone: "+1 (555) 123-4567",
  //     createdAt: "2023-02-15T10:30:00",
  //     ordersCount: 8,
  //     totalSpent: 457.86,
  //     lastOrderDate: "May 12, 2023",
  //     status: "active",
  //     channel: "facebook",
  //     avatar: "https://i.pravatar.cc/150?u=sarah",
  //   },
  //   {
  //     id: "c2",
  //     name: "John Peterson",
  //     email: "john.peterson@example.com",
  //     phone: "+1 (555) 234-5678",
  //     createdAt: "2023-03-22T14:45:00",
  //     ordersCount: 3,
  //     totalSpent: 189.99,
  //     lastOrderDate: "Apr 28, 2023",
  //     status: "active",
  //     channel: "whatsapp",
  //     avatar: "https://i.pravatar.cc/150?u=john",
  //   },
  //   {
  //     id: "c3",
  //     name: "Emma Thompson",
  //     email: "emma.thompson@example.com",
  //     phone: "+1 (555) 345-6789",
  //     createdAt: "2022-11-05T09:15:00",
  //     ordersCount: 12,
  //     totalSpent: 829.45,
  //     lastOrderDate: "May 15, 2023",
  //     status: "active",
  //     channel: "both",
  //     avatar: "https://i.pravatar.cc/150?u=emma",
  //   },
  //   {
  //     id: "c4",
  //     name: "Michael Brown",
  //     email: "michael.brown@example.com",
  //     phone: "+1 (555) 456-7890",
  //     createdAt: "2023-01-18T16:20:00",
  //     ordersCount: 1,
  //     totalSpent: 49.99,
  //     lastOrderDate: "Jan 18, 2023",
  //     status: "inactive",
  //     channel: "facebook",
  //     avatar: "https://i.pravatar.cc/150?u=michael",
  //   },
  //   {
  //     id: "c5",
  //     name: "Sophia Rodriguez",
  //     email: "sophia.rodriguez@example.com",
  //     phone: "+1 (555) 567-8901",
  //     createdAt: "2022-09-10T11:05:00",
  //     ordersCount: 7,
  //     totalSpent: 392.50,
  //     lastOrderDate: "Apr 02, 2023",
  //     status: "active",
  //     channel: "whatsapp",
  //     avatar: "https://i.pravatar.cc/150?u=sophia",
  //   },
  //   {
  //     id: "c6",
  //     name: "Daniel Johnson",
  //     email: "daniel.johnson@example.com",
  //     phone: "+1 (555) 678-9012",
  //     createdAt: "2023-04-05T08:30:00",
  //     ordersCount: 2,
  //     totalSpent: 124.75,
  //     lastOrderDate: "May 01, 2023",
  //     status: "active",
  //     channel: "facebook",
  //     avatar: "https://i.pravatar.cc/150?u=daniel",
  //   },
  // ]);

  if (isLoading) {
    return <div>Loading customers...</div>;
  }
  if (isError) {
    return <div>Error loading customers</div>;
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer profiles and interactions
        </p>
      </div>
      
      <CustomersList customers={customers} />
    </div>
  );
};


