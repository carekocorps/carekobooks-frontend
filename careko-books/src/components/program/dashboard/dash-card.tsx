"use client";

import React from "react";

interface StatCardProps {
  count: number;
  label: string;
  icon: React.ReactNode;
}

export function StatCard({ count, label, icon }: StatCardProps) {
  return (
    <div
      className="
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-2xl p-7
        shadow-lg dark:shadow-black/20
        flex items-center gap-4
        transition-transform hover:scale-[1.02] duration-200
      "
    >
      <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {count}
        </p>
      </div>
    </div>
  );
}
