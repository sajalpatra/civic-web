"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Users, Bell, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onQuickAction: (action: string) => void;
}

const quickActions = [
  {
    id: "new-report",
    label: "New Report",
    icon: FileText,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "add-user",
    label: "Add User",
    icon: Users,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    id: "send-notification",
    label: "Notification",
    icon: Bell,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export function FloatingActionButton({
  onQuickAction,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col-reverse gap-3 mb-3"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: index * 0.1 },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                    transition: {
                      delay: (quickActions.length - index - 1) * 0.05,
                    },
                  }}
                  onClick={() => {
                    onQuickAction(action.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-all hover:shadow-xl group",
                    action.color
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="whitespace-nowrap">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all",
          isOpen && "bg-red-500 hover:bg-red-600"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>

      {/* Tooltip for main button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
          >
            Quick Actions
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
