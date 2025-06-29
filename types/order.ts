
export interface Customer {
  id: number;
  name: string;
  avatar?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: Customer;
  date: string; // "YYYY-MM-DD HH:mm:ss"
  items: number;
  total: string;
  status: string;
  source: string;
  paymentStatus: string;
}


// export interface Order {
//   id: string;
//   orderNumber: string;
//   customer: {
//     id: string;
//     name: string;
//     avatar?: string;
//   };

//   date: string;
//   items: number;
//   total: number;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
//   source: "facebook" | "whatsapp" | "manual";
//   paymentStatus: "paid" | "pending" | "refunded";
// }