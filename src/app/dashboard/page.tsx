"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import RecentReports from "@/components/dashboard/RecentReports";
import { CommandModal } from "@/components/dashboard/CommandModal";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { LogoutModal } from "@/components/dashboard/LogoutModal";
import { ToastProvider, toast } from "@/components/ui/toast";
import { getDashboardStats, subscribeToReports } from "@/lib/dashboardService";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [mapStatusFilter, setMapStatusFilter] = useState("all");
  const [mapCategoryFilter, setMapCategoryFilter] = useState("all");
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    activeUsers: 0,
    averageResponseTime: 0,
    resolutionRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Load dashboard stats
  useEffect(() => {
    async function loadStats() {
      try {
        setStatsLoading(true);
        const stats = await getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        toast.error("Failed to load statistics", "Please refresh the page");
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();

    // Set up real-time subscription for reports
    const unsubscribe = subscribeToReports(() => {
      // Reload stats when reports change
      loadStats();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Command modal keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandModalOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleItemClick = (item: string) => {
    if (item === "logout") {
      setLogoutModalOpen(true);
    } else {
      setActiveItem(item);
    }
  };

  const handleLogout = async () => {
    try {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear any stored authentication data
      localStorage.removeItem("authToken");
      sessionStorage.clear();

      // Show success message
      toast.success(
        "Logged out successfully",
        "You have been signed out of your account"
      );

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", "Please try again");
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Handle different quick actions
    switch (action) {
      case "new-report":
        toast.info("New Report", "Report creation feature coming soon!");
        break;
      case "add-user":
        toast.info("Add User", "User management feature coming soon!");
        break;
      case "send-notification":
        toast.success(
          "Notification Sent",
          "Broadcast notification sent to all users!"
        );
        break;
      case "settings":
        setActiveItem("settings");
        toast.info("Settings", "Navigated to settings page");
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsLoading ? (
                  // Loading skeleton
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <StatCard
                      title="Total Reports"
                      value={dashboardStats.totalReports.toLocaleString()}
                      icon={<FileText className="h-6 w-6 text-blue-600" />}
                      change={{ value: 12, type: "increase" }}
                    />
                    <StatCard
                      title="Resolved"
                      value={dashboardStats.resolvedReports.toLocaleString()}
                      icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                      change={{
                        value: dashboardStats.resolutionRate,
                        type: "increase",
                      }}
                    />
                    <StatCard
                      title="Pending"
                      value={dashboardStats.pendingReports.toLocaleString()}
                      icon={<Clock className="h-6 w-6 text-yellow-600" />}
                    />
                    <StatCard
                      title="Active Users"
                      value={dashboardStats.activeUsers.toLocaleString()}
                      icon={<Users className="h-6 w-6 text-purple-600" />}
                      change={{ value: 15, type: "increase" }}
                    />
                  </>
                )}
              </div>

              {/* Charts */}
              <DashboardCharts />

              {/* Recent Reports */}
              <RecentReports />
            </motion.div>
          </AnimatePresence>
        );
      case "reports":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Reports Management
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Comprehensive reports view coming soon...
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      case "analytics":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Detailed analytics dashboard coming soon...
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      case "users":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  User Management
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  User management interface coming soon...
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      case "map":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filter Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status:
                    </label>
                    <select
                      value={mapStatusFilter}
                      onChange={(e) => setMapStatusFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="submitted">Submitted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category:
                    </label>
                    <select
                      value={mapCategoryFilter}
                      onChange={(e) => setMapCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="roads">Roads</option>
                      <option value="water">Water</option>
                      <option value="electricity">Electricity</option>
                      <option value="waste">Waste Management</option>
                      <option value="public safety">Public Safety</option>
                      <option value="parks">Parks</option>
                      <option value="streetlights">Street Lights</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setMapStatusFilter("all");
                      setMapCategoryFilter("all");
                    }}
                    className="ml-auto px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Map Container */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-[calc(100vh-16rem)]">
                  <Map
                    statusFilter={mapStatusFilter}
                    categoryFilter={mapCategoryFilter}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      default:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This section is under development...
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        );
    }
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case "dashboard":
        return "Dashboard Overview";
      case "reports":
        return "Reports Management";
      case "analytics":
        return "Analytics & Insights";
      case "users":
        return "User Management";
      case "map":
        return "Live Map View";
      case "messages":
        return "Messages & Communications";
      case "notifications":
        return "Notifications Center";
      case "settings":
        return "Settings & Configuration";
      case "help":
        return "Help & Support";
      default:
        return "CivicApp Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (activeItem) {
      case "dashboard":
        return "Monitor your civic engagement platform";
      case "reports":
        return "Manage and track citizen reports";
      case "analytics":
        return "Insights and performance metrics";
      case "users":
        return "User accounts and permissions";
      default:
        return "";
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
            onLogout={() => setLogoutModalOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>

        {/* Command Modal */}
        <CommandModal
          open={commandModalOpen}
          onClose={() => setCommandModalOpen(false)}
          onNavigate={handleItemClick}
        />

        {/* Logout Confirmation Modal */}
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />

        {/* Floating Action Button */}
        <FloatingActionButton onQuickAction={handleQuickAction} />
      </div>
    </ToastProvider>
  );
}
