"use client";

import { useState, useEffect } from "react";
import { Command } from "cmdk";
import {
  Search,
  FileText,
  Users,
  BarChart3,
  Settings,
  Map,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (item: string) => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "View overview and statistics",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    description: "Manage citizen reports",
  },
  { id: "users", label: "Users", icon: Users, description: "User management" },
  {
    id: "map",
    label: "Live Map",
    icon: Map,
    description: "View reports on map",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "View notifications",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "App settings",
  },
];

const quickActions = [
  {
    id: "new-report",
    label: "Create New Report",
    description: "Add a new civic report",
  },
  {
    id: "export-data",
    label: "Export Data",
    description: "Download reports as CSV",
  },
  {
    id: "send-notification",
    label: "Send Notification",
    description: "Broadcast to users",
  },
];

export function CommandModal({ open, onClose, onNavigate }: CommandModalProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <Command className="mx-auto w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center border-b border-gray-200 px-3 dark:border-gray-800">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search commands..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    value={item.label}
                    onSelect={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="Quick Actions">
              {quickActions.map((action) => (
                <Command.Item
                  key={action.id}
                  value={action.label}
                  onSelect={() => {
                    // Handle quick actions
                    console.log(`Executing: ${action.id}`);
                    onClose();
                  }}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50"
                >
                  <div className="mr-2 h-4 w-4 rounded border border-gray-300 dark:border-gray-600" />
                  <div className="flex flex-col">
                    <span>{action.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {action.description}
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t border-gray-200 p-1 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <div className="flex items-center justify-between px-2 py-1">
              <span>Press ⌘K to toggle</span>
              <span>ESC to close</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
