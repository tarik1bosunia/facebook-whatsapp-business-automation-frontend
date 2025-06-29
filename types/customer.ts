// types.ts
export type SocialMediaId = {
  facebook?: string;
  whatsapp?: string;
  // Add other platforms as needed
};

export type CustomerData = {
  name: string;
  email: string;
  phone: string;
  social_media_ids: SocialMediaId[];
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