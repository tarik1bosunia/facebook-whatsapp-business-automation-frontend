


import OrdersList from "@/features/orders/components/OrdersList";


export default function Orders() {


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


