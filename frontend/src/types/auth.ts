export interface User {
  avatarUrl: string | undefined;
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}
