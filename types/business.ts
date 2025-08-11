export interface BusinessHour {
  readonly id?: number;
  day: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

export interface BusinessProfile {
  readonly id?: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  hours: BusinessHour[];
}