'use client'


import CustomersList from "@/features/customers/components/CustomersList";
import { useGetCustomersQuery } from "@/lib/redux/services/customerApi";

export default function Customers() {
  const { data: customers, isLoading, isError } = useGetCustomersQuery();



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


