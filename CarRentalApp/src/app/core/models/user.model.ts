export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  password?: string; // Optional for safety
  token?: string;
  // Legacy
  name?: string;
}
