import { FaBell } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { User } from "next-auth";

interface DashboardHeaderProps {
  title: string;
  user: User;
}

export function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full px-8 pt-6 pb-2 rounded-t-2xl">
      <div className="flex flex-col gap-0.5">
        <span className="text-lg md:text-xl font-semibold text-[#081021] leading-tight">
          {t("DashboardHeader.greeting", {
            name: `${user.firstName || "User"} ${user.lastName || "Name"}`,
          })}
        </span>
        <span className="text-xs md:text-sm text-[#94A3B8] flex items-center gap-1">
          {title}
          <FiChevronDown className="inline ml-1" size={14} />
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <FaBell className="text-[#64748B] text-lg" />
          </div>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
}
