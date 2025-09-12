"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  searchReports,
  getCurrentUser,
  User as UserType,
} from "@/lib/dashboardService";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  onSearchResults?: (results: any[]) => void;
}

export function DashboardHeader({
  title,
  subtitle,
  className,
  onSearchResults,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    fetchCurrentUser();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setSearching(true);
      const results = await searchReports(query);

      if (onSearchResults) {
        onSearchResults(results);
      }

      toast.success(
        "Search completed",
        `Found ${results.length} results for "${query}"`
      );
    } catch (error) {
      console.error("Error searching reports:", error);
      toast.error("Search failed", "Please try again later");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 dark:border-gray-800 dark:bg-gray-950/95",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-9 w-64 rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser?.full_name ||
                currentUser?.email?.split("@")[0] ||
                "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser?.role || currentUser?.department || "User"}
            </p>
          </div>
          <Button variant="ghost" className="flex items-center space-x-2 p-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
