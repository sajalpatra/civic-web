"use client";
import {
  getReportsByDepartmentWithFilters,
  updateReportStatus,
  getAllReports,
  getReportsTableInfo,
  getReportsByCategory,
} from "../../lib/reports";
import { supabase } from "../../lib/supabaseClient";

// Helper to update any field in a report
async function updateReportField(id: string, fields: any) {
  await supabase.from("reports").update(fields).eq("id", id);
}
import ReportFilter from "../../components/ReportFilter";
import { useEffect, useState } from "react";
import ReportDetailsModal from "../../components/ReportDetailsModal";
import StatusBarChart from "../../components/StatusBarChart";
import { getReportStatusCounts } from "../../lib/reports";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import DarkModeToggle from "../../components/DarkModeToggle";

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showAllReports, setShowAllReports] = useState(false);
  const router = useRouter();
  const { user, department } = useAuth();

  const [filters, setFilters] = useState<any>({});
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    console.log("Current user:", user);
    console.log("Current department:", department);

    // Check table structure and get all reports for debugging
    getReportsTableInfo().then(() => {
      getAllReports().then((allReports) => {
        console.log("All reports in database:", allReports);
        if (allReports && allReports.length > 0) {
          console.log("Sample report structure:", allReports[0]);
          console.log("Available departments in reports:", [
            ...new Set(allReports.map((r) => r.department || "undefined")),
          ]);
        }
      });
    });

    setLoading(true);

    // Since database connection works, let's load all reports first
    // and then filter based on what we actually find in the data
    Promise.all([
      // Try the department filtering, but if it returns empty, fall back to all reports
      getReportsByDepartmentWithFilters(department || "water", filters)
        .then(async (deptReports) => {
          if (!deptReports || deptReports.length === 0) {
            console.log(
              "No reports found with department filtering, loading all reports"
            );
            const allReports = await getAllReports();
            // Filter by category if we have water department
            if (department === "water" && allReports) {
              const waterReports = allReports.filter(
                (report) =>
                  report.category &&
                  (report.category.toLowerCase().includes("water") ||
                    report.category.toLowerCase().includes("plumbing") ||
                    report.category.toLowerCase().includes("drainage") ||
                    report.category.toLowerCase().includes("sewage"))
              );
              console.log("Filtered water reports by category:", waterReports);
              return waterReports.length > 0 ? waterReports : allReports;
            }
            return allReports || [];
          }
          return deptReports;
        })
        .then(setReports),

      // For stats, get all reports and calculate
      getAllReports().then((allReports) => {
        const stats = {
          draft: 0,
          submitted: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0,
        };
        allReports?.forEach((report: any) => {
          if (report.status && stats.hasOwnProperty(report.status)) {
            stats[report.status as keyof typeof stats]++;
          }
        });
        setStats(stats);
      }),
    ]).finally(() => setLoading(false));
  }, [user, department, router, filters]);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      // Update stats after status change
      const updatedStats = { ...stats };
      if (updatedStats[status as keyof typeof updatedStats] !== undefined) {
        // This is a simplified stats update - you might want to re-fetch for accuracy
        updatedStats[status as keyof typeof updatedStats]++;
      }
      setStats(updatedStats);

      // Show success notification (you can implement toast notifications later)
      console.log(`Status updated to ${status} for report ${id}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Here you could show an error notification
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="animate-fade-in bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-slide-in-left flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3 hover:animate-cube-rotate" style={{transformStyle: 'preserve-3d'}}>
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300 hover:animate-tilt-3d">
                Civic Reports Dashboard
              </h1>
            </div>
            <div className="animate-slide-in-right flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:animate-depth-float">
                {department?.toUpperCase()} Department
              </span>
              <DarkModeToggle />
              <button
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:animate-perspective-bounce transform hover:scale-105"
                style={{perspective: '1000px'}}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Debug Information
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Current User: {user?.email} | Department: {department || "Not Set"}{" "}
            | Reports Found: {reports.length}
          </p>

          {/* Debug Buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => {
                setShowAllReports(!showAllReports);
                // Trigger a reload with the new setting
                setLoading(true);
                if (!showAllReports) {
                  getAllReports().then((allReports) => {
                    setReports(allReports || []);
                    setLoading(false);
                  });
                } else {
                  // Reload with department filtering
                  window.location.reload();
                }
              }}
              className={`px-3 py-1 text-xs rounded font-medium ${
                showAllReports
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {showAllReports ? "Show Filtered Reports" : "Show All Reports"}
            </button>
            <button
              onClick={async () => {
                console.log("=== Testing Database Connection ===");
                const allReports = await getAllReports();
                console.log("All reports:", allReports);
                setReports(allReports || []);
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Load All Reports
            </button>
            <button
              onClick={async () => {
                console.log("=== Testing Water Category ===");
                const waterReports = await getReportsByCategory("water");
                console.log("Water reports:", waterReports);
                setReports(waterReports || []);
              }}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Load Water Reports
            </button>
            <button
              onClick={async () => {
                console.log("=== Testing Table Structure ===");
                await getReportsTableInfo();
              }}
              className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
            >
              Check Table
            </button>
          </div>

          {reports.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-yellow-700 dark:text-yellow-300 cursor-pointer">
                Show Sample Report
              </summary>
              <pre className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(reports[0], null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Dashboard Title */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                Reports Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Manage and track civic reports for your department
              </p>
            </div>

            {/* Debug info */}
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Department:{" "}
                <span className="font-semibold">{department || "Not set"}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reports loaded:{" "}
                <span className="font-semibold">{reports.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mb-8">
          <StatusBarChart stats={stats} />
        </div>

        {/* Filters */}
        <div className="animate-slide-up bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all duration-300 hover:shadow-lg hover:animate-tilt-3d transform hover:scale-105" style={{perspective: '1000px', transformStyle: 'preserve-3d'}}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300 hover:animate-morph-3d">
            Filter Reports
          </h3>
          <ReportFilter onFilter={handleFilter} />
        </div>

        {/* Reports Table */}
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:animate-tilt-3d transform hover:scale-105" style={{perspective: '1000px', transformStyle: 'preserve-3d'}}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Reports ({reports.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:animate-depth-float"
                    style={{perspective: '1000px'}}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs transition-colors duration-300">
                            {report.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs transition-colors duration-300">
                            ID: {report.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors duration-300">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                          report.priority === "urgent"
                            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            : report.priority === "high"
                            ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                            : report.priority === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate transition-colors duration-300">
                      {report.address ||
                        `${report.location_latitude?.toFixed(
                          4
                        )}, ${report.location_longitude?.toFixed(4)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={report.status}
                        onChange={(e) =>
                          handleStatusChange(report.id, e.target.value)
                        }
                        className={`text-sm rounded-lg border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                          report.status === "resolved"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : report.status === "in_progress"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : report.status === "submitted"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Quick Status Actions */}
                        {report.status === "submitted" && (
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "in_progress")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                            title="Start working on this report"
                          >
                            Start
                          </button>
                        )}
                        {report.status === "in_progress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "resolved")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                            title="Mark as resolved"
                          >
                            Resolve
                          </button>
                        )}
                        {report.status === "resolved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "closed")
                            }
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                            title="Close this report"
                          >
                            Close
                          </button>
                        )}

                        {/* View Details Button */}
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                          onClick={() => {
                            setSelectedReport(report);
                            setModalOpen(true);
                          }}
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reports.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  No reports found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {Object.keys(filters).some((key) => filters[key])
                    ? "No reports match your current filters. Try adjusting your search criteria."
                    : "No reports have been submitted yet or you don't have access to view reports in this department."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Report Details Modal */}
      <ReportDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        report={selectedReport}
        onAssign={async (staff) => {
          if (!selectedReport) return;
          await updateReportField(selectedReport.id, { assigned_to: staff });
          setSelectedReport({ ...selectedReport, assigned_to: staff });
          setReports((prev) =>
            prev.map((r) =>
              r.id === selectedReport.id ? { ...r, assigned_to: staff } : r
            )
          );
        }}
        onAddComment={async (comment) => {
          if (!selectedReport) return;
          const newComments = [...(selectedReport.comments || []), comment];
          await updateReportField(selectedReport.id, { comments: newComments });
          setSelectedReport({ ...selectedReport, comments: newComments });
          setReports((prev) =>
            prev.map((r) =>
              r.id === selectedReport.id ? { ...r, comments: newComments } : r
            )
          );
        }}
      />
    </div>
  );
}
