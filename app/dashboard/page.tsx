"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlanAssetChart } from "@/components/PlanAssetChart";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { ParticipantsDonut } from "@/components/ParticipantsDonut";
import { ComplianceStatusCard } from "@/components/ComplianceStatusCard";
import { ContributionsBarChart } from "@/components/ContributionsBarChart";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "next-auth/react";
// import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data: session } = useSession();

  // usePlanStateRouting();

  return (
    <DashboardLayout
      title={t("DashboardHeader.companyName", { name: "GlidingPath" })}
      user={{
        firstName: session?.user?.firstName || "Guest",
        lastName: session?.user?.lastName || "",
        role: session?.user?.role || "employee",
        id: session?.user?.id || "",
        email: session?.user?.email || "",
      }}
      // onLogout={() => signOut({ callbackUrl: "/login" })}
    >
      {/* <div className="flex justify-end mb-4">
          <button
            onClick={switchLocale}
            className="px-4 py-2 rounded bg-[#6C3DF4] text-white font-semibold hover:bg-[#5327c6]"
            disabled={!isClient}
          >
            {currentLanguage === "en"
              ? t("Dashboard.languageSwitch.spanish")
              : t("Dashboard.languageSwitch.english")}
          </button>
        </div> */}
      <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
        <div className="flex-1 min-w-0">
          <PlanAssetChart />
        </div>
        <div className="w-full md:w-[380px] flex-shrink-0">
          <NotificationsPanel />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full mb-8 justify-center items-stretch">
        <div className="w-full md:w-[260px] flex-shrink-0 flex items-stretch">
          <ParticipantsDonut />
        </div>
        <div className="flex-1 min-w-0 flex items-stretch">
          <ComplianceStatusCard />
        </div>
      </div>
      <div className="w-full mb-8">
        <ContributionsBarChart />
      </div>
    </DashboardLayout>
  );
}
