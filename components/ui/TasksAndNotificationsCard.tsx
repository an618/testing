"use client";

import React from "react";

export function TasksAndNotificationsCard() {
  const notifications = [
    "View Yatra Online's 2024 Annual Disclosure",
    "View Yatra Online's 2024 Annual Disclosure",
    "View Yatra Online's 2024 Annual Disclosure",
    "View Yatra Online's 2024 Annual Disclosure",
    "View Yatra Online's 2024 Annual Disclosure",
    "View Yatra Online's 2024 Annual Disclosure",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tasks and Notifications
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View history
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm text-gray-700">{notification}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100">
                Hide
              </button>
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
