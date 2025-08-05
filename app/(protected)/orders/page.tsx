


import OrdersList from "@/features/orders/components/OrdersList";


export default function Orders() {
  // const [orders] = useState<Order[]>([
  //   {
  //     id: "ord1",
  //     orderNumber: "ORD-1001",
  //     customer: {
  //       id: "cust1",
  //       name: "Sarah Wilson",
  //       avatar: "https://i.pravatar.cc/150?u=sarah",
  //     },
  //     date: "May 15, 2023",
  //     items: 3,
  //     total: 127.95,
  //     status: "delivered",
  //     source: "facebook",
  //     paymentStatus: "paid",
  //   },
  //   {
  //     id: "ord2",
  //     orderNumber: "ORD-1002",
  //     customer: {
  //       id: "cust2",
  //       name: "John Peterson",
  //       avatar: "https://i.pravatar.cc/150?u=john",
  //     },
  //     date: "May 14, 2023",
  //     items: 1,
  //     total: 59.99,
  //     status: "processing",
  //     source: "whatsapp",
  //     paymentStatus: "paid",
  //   },
  //   {
  //     id: "ord3",
  //     orderNumber: "ORD-1003",
  //     customer: {
  //       id: "cust3",
  //       name: "Emma Thompson",
  //       avatar: "https://i.pravatar.cc/150?u=emma",
  //     },
  //     date: "May 13, 2023",
  //     items: 2,
  //     total: 89.90,
  //     status: "pending",
  //     source: "facebook",
  //     paymentStatus: "pending",
  //   },
  //   {
  //     id: "ord4",
  //     orderNumber: "ORD-1004",
  //     customer: {
  //       id: "cust5",
  //       name: "Sophia Rodriguez",
  //       avatar: "https://i.pravatar.cc/150?u=sophia",
  //     },
  //     date: "May 12, 2023",
  //     items: 4,
  //     total: 215.80,
  //     status: "shipped",
  //     source: "whatsapp",
  //     paymentStatus: "paid",
  //   },
  //   {
  //     id: "ord5",
  //     orderNumber: "ORD-1005",
  //     customer: {
  //       id: "cust6",
  //       name: "Daniel Johnson",
  //       avatar: "https://i.pravatar.cc/150?u=daniel",
  //     },
  //     date: "May 10, 2023",
  //     items: 1,
  //     total: 24.99,
  //     status: "cancelled",
  //     source: "manual",
  //     paymentStatus: "pending", // Changed from "refunded" to "pending" to match the allowed types
  //   },
  //   {
  //     id: "ord6",
  //     orderNumber: "ORD-1006",
  //     customer: {
  //       id: "cust4",
  //       name: "Michael Brown",
  //       avatar: "https://i.pravatar.cc/150?u=michael",
  //     },
  //     date: "May 09, 2023",
  //     items: 2,
  //     total: 79.98,
  //     status: "delivered",
  //     source: "manual",
  //     paymentStatus: "paid",
  //   },
  // ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and track order status
        </p>
      </div>
      
      <OrdersList  />
    </div>
  );
};


