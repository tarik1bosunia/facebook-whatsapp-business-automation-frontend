# Fixing the "Create Order" Button with RTK Query and Django REST Framework

This guide provides a step-by-step solution to fix the "Create Order" button functionality. It covers the necessary backend API endpoints using Django REST Framework and the frontend state management and API communication using Redux Toolkit (RTK) Query.

## Backend: Django REST Framework

We'll start by creating the necessary models, serializers, and views for our `Order` and `OrderItem` models.

### 1. Models (`orders/models.py`)

Here are the complete models for `Customer`, `Order`, and `OrderItem` that will be used.

```python
# orders/models.py

from django.db import models
from django.db.models import Sum
from django.core.validators import MinLengthValidator
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth import get_user_model

User = get_user_model()

# Assuming a Product model exists in a 'business' app
# from business.models import Product
# If not, here is a sample Product model:
class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # ... other product fields

    def __str__(self):
        return self.name

class Customer(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customers")
    name = models.CharField(max_length=100, verbose_name=_('Name'))
    phone = PhoneNumberField(blank=True, null=True, verbose_name=_('Phone Number'))
    city = models.CharField(max_length=100, verbose_name=_('City'))
    police_station = models.CharField(max_length=255, verbose_name=_('Police Station'))
    area = models.CharField(max_length=255, null=True, blank=True, verbose_name=_('Area/Street Address'))
    orders_count = models.PositiveIntegerField(default=0, verbose_name=_('Orders Count'))
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_('Total Spent'))
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE, verbose_name=_('Status'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Customer')
        verbose_name_plural = _('Customers')
        ordering = ['-updated_at']

    def __str__(self):
        return self.name

    def update_stats(self):
        stats = self.orders.aggregate(count=models.Count('id'), total=Sum('total'))
        self.orders_count = stats.get('count') or 0
        self.total_spent = stats.get('total') or 0
        self.save(update_fields=['orders_count', 'total_spent'])

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        SHIPPED = 'shipped', _('Shipped')
        DELIVERED = 'delivered', _('Delivered')
        CANCELLED = 'cancelled', _('Cancelled')

    class PaymentStatus(models.TextChoices):
        PAID = 'paid', _('Paid')
        PENDING = 'pending', _('Pending')
        REFUNDED = 'refunded', _('Refunded')

    class Source(models.TextChoices):
        FACEBOOK = 'facebook', _('Facebook')
        WHATSAPP = 'whatsapp', _('Whatsapp')
        MANUAL = 'manual', _('Manual')

    order_number = models.CharField(max_length=30, unique=True, verbose_name=_('Order Number'), validators=[MinLengthValidator(5)])
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders', verbose_name=_('Customer'))
    items = models.PositiveIntegerField(verbose_name=_('Items Count'), default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Order Total'))
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, verbose_name=_('Order Status'))
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.MANUAL, verbose_name=_('Source'))
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, verbose_name=_('Payment Status'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.order_number} - {self.customer.name}"

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            self.customer.update_stats()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('order', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return self.quantity * self.product.price
```

### 2. Serializers (`orders/serializers.py`)

Create a `serializers.py` file in your order app. This handles the conversion of your models to JSON and validates incoming data.

```python
# orders/serializers.py

from rest_framework import serializers
from .models import Order, OrderItem, Customer, Product
import uuid

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    order_items = OrderItemSerializer(many=True, read_only=True) # For reading nested items

    class Meta:
        model = Order
        fields = [
            'id', 
            'customer', 
            'items', # write-only
            'order_items', # read-only
            'status', 
            'payment_status', 
            'source',
            'total',
            'created_at',
            'order_number'
        ]
        read_only_fields = ['total', 'order_number', 'created_at', 'id', 'order_items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total and item count
        total_price = 0
        item_count = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            if product.price is None:
                raise serializers.ValidationError(f"Product {product.name} does not have a price.")

            total_price += product.price * quantity
            item_count += quantity

        # Add calculated fields to validated_data
        validated_data['total'] = total_price
        validated_data['items'] = item_count
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"

        # Create the order instance
        order = Order.objects.create(**validated_data)
        
        # Create OrderItem instances
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order
```

### 3. Views (`orders/views.py`)

Create the view in `orders/views.py`. We will use a `ModelViewSet` for simplicity, which handles LIST, CREATE, RETRIEVE, UPDATE, and DESTROY actions.

```python
# orders/views.py

from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or created.
    """
    queryset = Order.objects.all().select_related('customer').prefetch_related('order_items__product').order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated] # Secure the endpoint

    def get_queryset(self):
        # Ensure users can only see their own orders if not admin
        if self.request.user.is_staff:
            return super().get_queryset()
        # Assuming Customer model has a 'user' foreign key
        return super().get_queryset().filter(customer__user=self.request.user)
```

### 4. URLs (`orders/urls.py`)

Wire up the `ViewSet` to your API's URL configuration.

```python
# orders/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('api/', include(router.urls)),
]
```
Make sure to include these URLs in your project's main `urls.py`.

## Frontend: RTK Query

Now, let's set up the frontend to use this new API endpoint.

### 1. Create an Order API Slice (`lib/redux/services/ordersApi.ts`)

Define an API slice for orders to handle API communication.

```typescript
// lib/redux/services/ordersApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery'; // Assuming you have a baseQuery setup

// --- Interfaces ---
interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  product: number; // product id
  quantity: number;
}

interface Order {
  id: number;
  customer: number; // customer id
  order_items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'refunded';
  source: 'facebook' | 'whatsapp' | 'manual';
  total: string;
  created_at: string;
  order_number: string;
}

type NewOrderRequest = {
  customer: number;
  items: OrderItem[];
  source: 'facebook' | 'whatsapp' | 'manual';
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'paid' | 'pending' | 'refunded';
}

// --- API Slice ---
export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQuery,
  tagTypes: ['Order', 'Product', 'Customer'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, NewOrderRequest>({
      query: (newOrder) => ({
        url: 'api/orders/',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    getOrders: builder.query<Order[], void>({
        query: () => 'api/orders/',
        providesTags: (result) => 
            result 
            ? [...result.map(({ id }) => ({ type: 'Order' as const, id })), { type: 'Order', id: 'LIST' }]
            : [{ type: 'Order', id: 'LIST' }]
    }),
    // Add endpoints to get products and customers for your form
    getProducts: builder.query<Product[], void>({
        query: () => 'api/products/', // Assuming you have a product endpoint
        providesTags: (result) => 
            result 
            ? [...result.map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
            : [{ type: 'Product', id: 'LIST' }]
    }),
    getCustomers: builder.query<any[], void>({ // Replace 'any' with your Customer type
        query: () => 'api/customers/', // Assuming you have a customer endpoint
        providesTags: (result) => 
            result 
            ? [...result.map(({ id }) => ({ type: 'Customer' as const, id })), { type: 'Customer', id: 'LIST' }]
            : [{ type: 'Customer', id: 'LIST' }]
    }),
  }),
});

export const { 
    useCreateOrderMutation, 
    useGetOrdersQuery,
    useGetProductsQuery,
    useGetCustomersQuery,
} = ordersApi;
```

### 2. Implement the "Create Order" Component (`features/orders/components/CreateOrderForm.tsx`)

This enhanced form provides a better user experience for a business owner creating an order. It includes a searchable product list and a detailed cart with quantity controls.

```tsx
// features/orders/components/CreateOrderForm.tsx

import React, { useState, useMemo } from 'react';
import { 
    useCreateOrderMutation,
    useGetProductsQuery,
    useGetCustomersQuery,
} from '@/lib/redux/services/ordersApi';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
    product: number;
    quantity: number;
}

const CreateOrderForm = () => {
  const [createOrder, { isLoading, isSuccess, isError, error }] = useCreateOrderMutation();
  const { data: products = [] } = useGetProductsQuery();
  const { data: customers = [] } = useGetCustomersQuery();

  const [selectedCustomer, setSelectedCustomer] = useState<number | ''>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateCart = (productId: number, quantity: number) => {
    setCart(currentCart => {
        const itemInCart = currentCart.find(item => item.product === productId);
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return currentCart.filter(item => item.product !== productId);
        }
        if (itemInCart) {
            // Update quantity for existing item
            return currentCart.map(item => 
                item.product === productId ? { ...item, quantity } : item
            );
        }
        // Add new item
        return [...currentCart, { product: productId, quantity }];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCustomer || cart.length === 0) {
        alert("Please select a customer and add products to the order.");
        return;
    }
    
    const newOrderData = {
      customer: selectedCustomer,
      items: cart,
      source: 'manual' as const,
    };

    try {
      await createOrder(newOrderData).unwrap();
      // Reset form on success
      setSelectedCustomer('');
      setCart([]);
      setSearchTerm('');
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.product);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {/* Left Column: Customer and Product Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Create New Order</h2>
        
        {/* Customer Selection */}
        <div>
          <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            id="customer-select"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        {/* Product Search and List */}
        <div>
          <label htmlFor="product-search" className="block text-sm font-medium text-gray-700">Search Products</label>
          <input
            type="text"
            id="product-search"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <div className="mt-4 h-64 overflow-y-auto border rounded-md">
            {filteredProducts.map(product => (
                <div key={product.id} className="p-2 flex justify-between items-center border-b">
                    <span>{product.name} - ${product.price.toFixed(2)}</span>
                    <button type="button" onClick={() => handleUpdateCart(product.id, (cart.find(item => item.product === product.id)?.quantity || 0) + 1)} className="text-sm text-indigo-600 hover:text-indigo-900 font-semibold">Add</button>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Cart and Summary */}
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold">Current Order</h3>
        <div className="space-y-4 h-80 overflow-y-auto">
            {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
            ) : (
                cart.map(item => {
                    const product = products.find(p => p.id === item.product);
                    if (!product) return null;
                    return (
                        <div key={item.product} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleUpdateCart(product.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => handleUpdateCart(product.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                                <button type="button" onClick={() => handleUpdateCart(product.id, 0)} className="text-red-500 hover:text-red-700 ml-2">Remove</button>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
        <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={isLoading || cart.length === 0} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
            {isSuccess && <p className="text-green-600 mt-2">Order created successfully!</p>}
            {isError && <p className="text-red-600 mt-2">Error: {JSON.stringify(error)}</p>}
        </div>
      </div>
    </form>
  );
};

export default CreateOrderForm;
```

### 3. Add API Slice to Redux Store (`lib/redux/store.ts`)

Finally, make sure to add the `ordersApi` reducer to your Redux store.

```typescript
// lib/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { ordersApi } from './services/ordersApi';
// Import other APIs if you have them
// import { productsApi } from './services/productsApi'; 
// import { customersApi } from './services/customersApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [ordersApi.reducerPath]: ordersApi.reducer,
    // [productsApi.reducerPath]: productsApi.reducer,
    // [customersApi.reducerPath]: customersApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        ordersApi.middleware,
        // productsApi.middleware,
        // customersApi.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

This setup provides a robust way to handle order creation, with automatic caching, loading state management, and error handling provided by RTK Query.