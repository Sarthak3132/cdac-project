import { AdminAnalyticsDashboard } from "@/features/admin/components/dashboard/admin-analytics-dashboard";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform analytics and metrics</p>
      </div>
      <AdminAnalyticsDashboard />
    </div>
  );
}