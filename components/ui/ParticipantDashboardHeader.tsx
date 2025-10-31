"use client";

import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export function ParticipantDashboardHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Home screen
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-medium text-gray-900">
              Alex Rivera
            </span>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">YATRA Online Inc</span>
              <Icon
                icon="heroicons:chevron-down"
                className="w-4 h-4 text-gray-400"
              />
            </div>
          </div>
        </div>
        <Icon icon="heroicons:bell" className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  );
}
