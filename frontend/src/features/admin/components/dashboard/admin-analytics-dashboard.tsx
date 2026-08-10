import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsCard } from "./analytics-card";
import { UserGrowthChart } from "./user-growth-chart";
import { getAnalytics } from "@/services/admin-analytics-service";
import type { AdminAnalyticsDto } from "@/types/admin-analytics";
import { Users, TrendingUp, UserCheck, Activity } from "lucide-react";

export function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-red-500">{error || "No data available"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          label="Total Users"
          value={analytics.totalUsers}
          icon={<Users />}
        />
        <AnalyticsCard
          label="Active Users (This Week)"
          value={analytics.activeUsersThisWeek}
          icon={<UserCheck />}
        />
        <AnalyticsCard
          label="New Users (This Month)"
          value={analytics.newUsersThisMonth}
          icon={<TrendingUp />}
        />
        <AnalyticsCard
          label="Total Submissions"
          value={analytics.totalSubmissions}
          icon={<Activity />}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalyticsCard
          label="Submissions (This Week)"
          value={analytics.submissionsThisWeek}
          icon={<Activity />}
        />
      </div>

      {/* Chart */}
      {analytics.userGrowthLast30Days.length > 0 && (
        <UserGrowthChart data={analytics.userGrowthLast30Days} />
      )}
    </div>
  );
}