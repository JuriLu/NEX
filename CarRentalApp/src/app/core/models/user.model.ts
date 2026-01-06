export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole
  password?: string; // Optional for safety
  token?: string;
  // Legacy
  name?: string;
}
