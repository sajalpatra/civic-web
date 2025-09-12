"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Home,
  Map,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "map", label: "Live Map", icon: Map },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const bottomItems = [
  { id: "help", label: "Help", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Logout", icon: LogOut },
];

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className="h-6 w-6" />
          ) : (
            <X className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4">
            <motion.div className="flex items-center space-x-2" layout>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  CivicApp
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom Items */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Collapse Toggle (Desktop) */}
          <div className="hidden lg:block border-t border-gray-200 dark:border-gray-800 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full"
            >
              <Menu className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
