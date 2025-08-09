
import {CustomerCreateResponse, ApiErrorResponse } from '@/types';
import { apiSlice } from './../api/apiSlice';
import { Customer, NewCustomer } from '@/types/customer';

const CREATE_CUSTOMER_URL = 'customer/create/';
const GET_CUSTOMERS_URL = 'customer/customers/';


// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   createdAt: string;
//   ordersCount: number;
//   totalSpent: number;
//   lastOrderDate?: string;
//   status: "active" | "inactive";
//   channel: "facebook" | "whatsapp" | "both";
//   avatar?: string;
// }


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
      transformErrorResponse: (response: ApiErrorResponse) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetCustomersQuery, useCreateCustomerMutation } = customerApi;