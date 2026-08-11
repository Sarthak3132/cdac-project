export interface UserGrowthDto {
  date: string; // ISO date string
  count: number;
}

export interface AdminAnalyticsDto {
  totalUsers: number;
  activeUsersThisWeek: number;
  newUsersThisMonth: number;
  userGrowthLast30Days: UserGrowthDto[];
  totalSubmissions: number;
  submissionsThisWeek: number;
}

export type ApiResponse<T> = {
  message: string;
  data: T;
};