
'use client'; 
import { useGetOrderByIdQuery } from '@/lib/redux/services/orderApi';
import { useParams } from 'next/navigation';


export default function OrderDetailsPage ()  {
  const {id} = useParams<{id:string}>();
  const {data: order, isLoading, isError} = useGetOrderByIdQuery(id);

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (isError) return <div className="p-6 text-center text-red-600">Error loading order details</div>;
  if (!order) return <div className="p-6 text-center">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Order #{order.orderNumber}</h1>
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={order.customer.avatar}
          alt={order.customer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{order.customer.name}</p>
          <p className="text-gray-500">Customer ID: {order.customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Date</span>
          <p>{order.date}</p>
        </div>
        <div>
          <span className="text-gray-600">Status</span>
          <p className="capitalize">{order.status}</p>
        </div>
        <div>
          <span className="text-gray-600">Payment Status</span>
          <p className="capitalize">{order.paymentStatus}</p>
        </div>
        <div>
          <span className="text-gray-600">Source</span>
          <p className="capitalize">{order.source}</p>
        </div>
        <div>
          <span className="text-gray-600">Items</span>
          <p>{order.items}</p>
        </div>
        <div>
          <span className="text-gray-600">Total</span>
          <p className="font-semibold">${order.total}</p>
        </div>
      </div>
    </div>
  )
}

