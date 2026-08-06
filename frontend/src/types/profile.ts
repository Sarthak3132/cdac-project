export type UserProfile = {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  role?: "USER" | "ADMIN";
};