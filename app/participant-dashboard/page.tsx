"use client";

import React from "react";
import {
  ParticipantSidebar,
  ParticipantDashboardHeader,
  TotalRetirementSavingCard,
  ContributionsCard,
  TasksAndNotificationsCard,
} from "@/components/ui";

export default function ParticipantDashboard() {
  return (
    <div className="min-h-screen flex bg-[#F6F8FC]">
      <ParticipantSidebar />
      <div className="flex-1">
        <ParticipantDashboardHeader />
        <main className="p-8">
          <div className="space-y-8">
            {/* Top Row - Total Retirement Saving and Contributions side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-72 overflow-hidden">
              {/* Total Retirement Saving - takes 2/3 of the width */}
              <div className="lg:col-span-2">
                <TotalRetirementSavingCard />
              </div>

              {/* Contributions - takes 1/3 of the width */}
              <div className="lg:col-span-1">
                <ContributionsCard />
              </div>
            </div>

            {/* Bottom Row - Tasks and Notifications spans full width */}
            <div>
              <TasksAndNotificationsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
