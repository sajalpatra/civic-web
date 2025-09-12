"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reportsData = [
  { month: "Jan", resolved: 45, pending: 15, total: 60 },
  { month: "Feb", resolved: 52, pending: 18, total: 70 },
  { month: "Mar", resolved: 48, pending: 22, total: 70 },
  { month: "Apr", resolved: 61, pending: 19, total: 80 },
  { month: "May", resolved: 55, pending: 25, total: 80 },
  { month: "Jun", resolved: 67, pending: 23, total: 90 },
];

const categoryData = [
  { name: "Road Issues", value: 35, color: "#3B82F6" },
  { name: "Waste Management", value: 25, color: "#10B981" },
  { name: "Water Supply", value: 20, color: "#F59E0B" },
  { name: "Street Lights", value: 15, color: "#EF4444" },
  { name: "Others", value: 5, color: "#8B5CF6" },
];

const responseTimeData = [
  { day: "Mon", avgTime: 2.4 },
  { day: "Tue", avgTime: 1.8 },
  { day: "Wed", avgTime: 3.2 },
  { day: "Thu", avgTime: 2.1 },
  { day: "Fri", avgTime: 2.8 },
  { day: "Sat", avgTime: 1.9 },
  { day: "Sun", avgTime: 1.5 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Reports Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="xl:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Issue Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Response Time Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="xl:col-span-3"
      >
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time (Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
