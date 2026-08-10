import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserGrowthDto } from "@/types/admin-analytics";

interface UserGrowthChartProps {
  data: UserGrowthDto[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              fontSize={12}
              stroke="var(--color-muted-foreground)"
            />
            <YAxis 
              fontSize={12}
              stroke="var(--color-muted-foreground)"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#818cf8"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}