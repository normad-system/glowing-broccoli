export interface User {
  id: number;
  email: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  role: 'CUSTOMER' | 'EDITOR' | 'ADMIN';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
