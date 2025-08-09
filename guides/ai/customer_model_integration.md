# Customer Model Integration Guide

This guide outlines the necessary steps to integrate the new `Customer` model into the Django DRF backend and the Next.js frontend with RTK Query.

## Backend: Django DRF

### 1. Serializer

Create a `serializers.py` file in your customer app or add the following serializer to your existing `serializers.py`.

```python
from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'name',
            'phone',
            'city',
            'police_station',
            'area',
            'orders_count',
            'total_spent',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['orders_count', 'total_spent', 'created_at', 'updated_at']

```

### 2. ViewSet

Create a `views.py` file in your customer app or add the following viewset to your existing `views.py`.

```python
from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customers to be viewed or edited.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    # Add permission classes if needed, e.g., IsAuthenticated
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the customers
        for the currently authenticated user.
        """
        user = self.request.user
        return Customer.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Associate the customer with the logged-in user.
        """
        serializer.save(user=self.request.user)
```

### 3. URLs

Add the following to your `urls.py` to register the new viewset.

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

## Frontend: Next.js with RTK Query

### 1. Type Definition

Update your `types/index.ts` or a relevant types file with the new `Customer` type.

```typescript
// types/index.ts

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  city: string;
  police_station: string;
  area?: string | null;
  orders_count: number;
  total_spent: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

### 2. RTK Query API Slice

Update your RTK Query API slice for customers. Create a new file `lib/redux/features/customers/customerApi.ts` or update your existing one.

```typescript
// lib/redux/features/customers/customerApi.ts
import { api } from '@/lib/redux/api';
import { PaginatedResponse, Customer } from '@/types';

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<PaginatedResponse<Customer>, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => `customers/?page=${page}&search=${search}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    addCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: 'customers/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    updateCustomer: builder.mutation<Customer, { id: number; body: Partial<Customer> }>({
        query: ({ id, body }) => ({
          url: `customers/${id}/`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
      }),
  }),
});

export const { useGetCustomersQuery, useAddCustomerMutation, useUpdateCustomerMutation } = customerApi;
```