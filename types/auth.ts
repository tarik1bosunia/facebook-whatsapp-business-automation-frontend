export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: {
    refresh: string;
    access: string;
  };
  message: string;
}

export interface ErrorResponse {
  errors?: {
    email?: string[];
    password?: string[];
    non_field_errors?: string[];
  };
}



export interface RegistrationRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface PasswordResetRequest {
  password: string;
}

export interface EmailChangeRequest {
  new_email: string;
  current_password: string;
}

export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
}