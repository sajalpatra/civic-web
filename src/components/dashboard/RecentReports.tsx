"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, getStatusColor, getPriorityColor, formatDate } from "@/lib/utils";
import {
  getRecentReports,
  updateReportStatus,
  Report,
} from "@/lib/dashboardService";
import { toast } from "@/components/ui/toast";

export default function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const data = await getRecentReports(10);
        setReports(data);
      } catch (error) {
        console.error("Error fetching recent reports:", error);
        toast.error("Failed to load reports", "Please try again later");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      setUpdatingStatus(reportId);
      await updateReportStatus(reportId, newStatus);

      // Update local state
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus as any }
            : report
        )
      );

      toast.success("Status Updated", `Report status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Update Failed", "Could not update report status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getDisplayLocation = (report: Report) => {
    return (
      report.address ||
      `${report.location_latitude?.toFixed(
        4
      )}, ${report.location_longitude?.toFixed(4)}` ||
      "Unknown location"
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No reports found
              </p>
            </div>
          ) : (
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
                      Reporter
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {report.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                            {report.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {getDisplayLocation(report)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="truncate max-w-xs">
                          <p className="font-medium">
                            {report.reporter || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(report.created_at)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {report.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={report.status}
                          onChange={(e) =>
                            handleStatusChange(report.id, e.target.value)
                          }
                          disabled={updatingStatus === report.id}
                          className={cn(
                            "text-sm rounded-lg border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50",
                            getStatusColor(report.status)
                          )}
                        >
                          <option value="draft">Draft</option>
                          <option value="submitted">Submitted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
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
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
