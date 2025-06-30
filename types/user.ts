import { Role } from "./role";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}



export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  avatar?: string
}

export interface UpdateUserProfilePayload {
  first_name?: string;
  last_name?: string;
  role?: string;
}