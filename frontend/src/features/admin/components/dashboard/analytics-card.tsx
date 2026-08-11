import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface AnalyticsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: "green" | "red" | "gray";
}

export function AnalyticsCard({
  label,
  value,
  icon,
  trend,
  trendColor = "gray",
}: AnalyticsCardProps) {
  const trendColorClass = {
    green: "text-green-500",
    red: "text-red-500",
    gray: "text-muted-foreground",
  }[trendColor];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={`text-xs mt-2 ${trendColorClass}`}>{trend}</p>
            )}
          </div>
          <div className="text-3xl opacity-50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}