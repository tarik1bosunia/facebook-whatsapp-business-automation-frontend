
import { CustomerData, CustomerCreateResponse, ApiErrorResponse } from '@/types';
import { apiSlice } from './../api/apiSlice';
import { Order } from '@/types/order';

const CREATE_ORDER_URL = 'customer/orders/create/';
const GET_ORDERS_URL = 'customer/orders/';



export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOders: builder.query<Order[], void>({
      query: () => ({
        url: GET_ORDERS_URL,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query<Order, string>({
        query: (id) => ({
            url: `${GET_ORDERS_URL}${id}/`,
            method: 'GET',
        }),
        }),

    createOrder: builder.mutation<CustomerCreateResponse, CustomerData>({
      query: (customerData) => ({
        url: CREATE_ORDER_URL,
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

export const { useGetOdersQuery, useCreateOrderMutation, useGetOrderByIdQuery } = orderApi;