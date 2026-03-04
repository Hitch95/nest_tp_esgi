export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user';

export const USER_ROLES: UserRole[] = ['admin', 'user'];
