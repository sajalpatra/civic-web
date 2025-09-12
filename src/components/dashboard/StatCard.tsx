"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    change.type === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {change.type === "increase" ? "+" : "-"}
                  {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
