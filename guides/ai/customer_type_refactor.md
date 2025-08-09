# Refactoring Customer Type Definitions

This guide provides the updated code for centralizing and improving the `Customer` type definitions. The changes ensure consistency across the application, from the API layer to the form handling logic.

## 1. Centralized Type Definitions (`types/customer.ts`)

All customer-related types are now consolidated in this file for a single source of truth.

```typescript
// types/customer.ts

/**
 * Represents the full Customer object, as returned by the API.
 */
export type Customer = {
  id: number;
  name: string;
  phone: string;
  city: string;
  police_station: string;
  area: string | null;
  orders_count: number;
  total_spent: number;
  status: "active" | "inactive";
  avatar: string;
  channel: "facebook" | "whatsapp" | "both" | 'unknown';
  last_order_date: string; // ISO datetime string
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
};

/**
 * Represents the data payload required to create a new customer.
 * This is what the frontend form should submit to the API.
 */
export type NewCustomer = {
  name: string;
  phone: string;
  city: string;
  police_station: string;
  area?: string; // Area is optional
};

/**
 * Represents the successful response from the customer creation endpoint.
 */
export type CustomerCreateResponse = {
  detail: string;
  id?: string;
  created_at?: string;
};

/**
 * Represents a generic API error response structure.
 */
export type ApiErrorResponse = {
  status: number;
  data: {
    detail?: string;
    errors?: Record<string, string[]>;
  };
};
```

## 2. Updated Customer API Slice (`lib/redux/services/customerApi.ts`)

The API slice is updated to use the new, centralized types from `types/customer.ts`.

```typescript
// lib/redux/services/customerApi.ts

import { apiSlice } from './../api/apiSlice';
import { 
  Customer, 
  NewCustomer, 
  CustomerCreateResponse, 
  ApiErrorResponse 
} from '@/types/customer';

const CREATE_CUSTOMER_URL = 'customer/create/';
const GET_CUSTOMERS_URL = 'customer/customers/';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: GET_CUSTOMERS_URL,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),

    createCustomer: builder.mutation<CustomerCreateResponse, NewCustomer>({
      query: (customerData) => ({
        url: CREATE_CUSTOMER_URL,
        method: 'POST',
        body: customerData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
      transformErrorResponse: (response: ApiErrorResponse) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetCustomersQuery, useCreateCustomerMutation } = customerApi;