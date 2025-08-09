// types.ts
export type SocialMediaId = {
  facebook?: string;
  whatsapp?: string;
  // Add other platforms as needed
};

export type NewCustomer = {
  name: string;
  phone: string;
  social_media_ids: SocialMediaId[];
  city: string;
  police_station: string;
  area: string | null;
};

export type CustomerCreateResponse = {
  detail: string;
  id?: string;
  created_at?: string;
};

export type ApiErrorResponse = {
  status: number;
  data: {
    detail?: string;
    errors?: Record<string, string[]>;
    social_media_ids?: string[];
  };
};

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