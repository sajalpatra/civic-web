"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, getStatusColor, getPriorityColor, formatDate } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  location: string;
  reporter: string;
  date: string;
}

const recentReports: Report[] = [
  {
    id: "RPT-001",
    title: "Broken streetlight on Main Street",
    category: "Street Lights",
    status: "Open",
    priority: "High",
    location: "Main Street, Block A",
    reporter: "John Smith",
    date: "2024-01-15",
  },
  {
    id: "RPT-002",
    title: "Pothole near City Center",
    category: "Road Issues",
    status: "In Progress",
    priority: "Medium",
    location: "City Center Road",
    reporter: "Jane Doe",
    date: "2024-01-14",
  },
  {
    id: "RPT-003",
    title: "Garbage collection missed",
    category: "Waste Management",
    status: "Resolved",
    priority: "Low",
    location: "Residential Area B",
    reporter: "Mike Johnson",
    date: "2024-01-13",
  },
  {
    id: "RPT-004",
    title: "Water supply disruption",
    category: "Water Supply",
    status: "Open",
    priority: "High",
    location: "Oak Avenue",
    reporter: "Sarah Wilson",
    date: "2024-01-12",
  },
  {
    id: "RPT-005",
    title: "Damaged sidewalk",
    category: "Road Issues",
    status: "In Progress",
    priority: "Medium",
    location: "Pine Street",
    reporter: "Robert Brown",
    date: "2024-01-11",
  },
];

export function RecentReports() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reports</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {report.id}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {report.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {report.category}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getStatusColor(report.status)
                        )}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getPriorityColor(report.priority)
                        )}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(report.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
