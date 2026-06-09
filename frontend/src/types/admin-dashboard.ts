// features/admin/types.ts
export type StatCard = {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedAt: string;
  solved: number;
  status: "active" | "banned";
};

export type AdminProblem = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  submissions: number;
  acceptanceRate: number;
  status: "published" | "draft";
};

export type AdminSubmission = {
  id: number;
  user: string;
  problem: string;
  language: string;
  status: "Accepted" | "Wrong Answer" | "TLE" | "Runtime Error" | "Compile Error";
  runtime: string;
  memory: string;
  submittedAt: string;
};

export type AdminTab = "overview" | "users" | "problems" | "submissions";
