// types/aimodel.ts
export interface AIModel {
  id: string;  // Django models automatically get an 'id' field
  code: string;
  name: string;
  is_custom: boolean;
}

// For POST/PUT requests where 'id' might not be needed
export interface AIModelCreateUpdate {
  code: string;
  name: string;
  is_custom?: boolean;  // Optional with default false
}