export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}
