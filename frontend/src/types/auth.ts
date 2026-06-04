export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}
