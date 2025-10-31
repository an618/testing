"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/hooks/useLanguage";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";

const getData = (t: (key: string) => string) => [
  { name: t("InvestmentPlan.allocationMix.investments.stockBond1"), value: 30 },
  { name: t("InvestmentPlan.allocationMix.investments.stockBond2"), value: 20 },
  { name: t("InvestmentPlan.allocationMix.investments.stockBond3"), value: 20 },
  { name: t("InvestmentPlan.allocationMix.investments.stockBond4"), value: 15 },
  { name: t("InvestmentPlan.allocationMix.investments.stockBond5"), value: 15 },
];

const RADIAN = Math.PI / 180;
const COLORS = [
  "var(--custom-brandStart)",
  "var(--custom-blue-100)",
  "var(--custom-cyan-100)",
  "var(--custom-coral-100)",
  "var(--custom-yellow-100)",
];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle?: number;
  outerRadius: number;
  percent?: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = outerRadius;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={18}
        fill="#f5f5f5"
        stroke="#e0e0e0"
        strokeWidth={1}
        style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.15))" }}
      />
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

export default function InvestmentPlanPage() {
  const { t, isClient } = useLanguage();
  const data = getData(t);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col gap-10 md:items-center pt-8 md:pt-0 md:justify-center bg-gradient-to-r from-brandStart to-brandEnd px-2">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold  text-primary">
            {t("InvestmentPlan.title")}
          </h1>
          <p className="text-gray-600 text-base">
            {t("InvestmentPlan.subtitle")}
          </p>
          <div className="inline-block">
            <SecondaryButton
              text={t("InvestmentPlan.autoSelected")}
              onClick={() => {}}
              className="!w-full sm:!w-fit !px-4 !py-2 !rounded-md !font-medium"
              containerClassName="!rounded-lg"
            />
          </div>
        </div>

        {/* 2045 Retirement Fund Card */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm p-10 gap-6">
          <div className="border border-custom-primary-100 p-3 rounded-lg">
            <h2 className="text-base font-semibold text-custom-gray-700 mb-3">
              {t("InvestmentPlan.retirementFund.title")}
            </h2>
            <p className="font-normal text-base text-custom-gray-500 mb-6">
              {t("InvestmentPlan.retirementFund.description")}
            </p>
          </div>
          <div className="flex justify-evenly gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-custom-green-100 rounded-full"></div>
              <span className="text-custom-gray-400 font-semibold text-base">
                {t("InvestmentPlan.retirementFund.features.autoRebalancing")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-custom-green-100 rounded-full"></div>
              <span className="text-custom-gray-400 font-semibold text-base">
                {t("InvestmentPlan.retirementFund.features.lowFees")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-custom-green-100 rounded-full"></div>
              <span className="text-custom-gray-400 font-semibold text-base">
                {t(
                  "InvestmentPlan.retirementFund.features.professionalManagement"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Current Allocation Mix Card */}
        <div className="bg-white rounded-2xl shadow-sm p-10">
          <h2 className="text-base font-semibold text-custom-gray-700">
            {t("InvestmentPlan.allocationMix.title")}
          </h2>
          <div className="flex items-center">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="w-full max-w-sm">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full lg:w-1/2 space-y-3 border border-custom-primary-100 p-4 rounded-lg">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why This Mix Works for You Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-custom-gray-700">
                {t("InvestmentPlan.whyThisMix.title")}
              </h2>
            </div>
            <div className="text-base font-normal bg-custom-quaternary-100 p-4 rounded-lg">
              <p className="text-gray-700">
                {t("InvestmentPlan.whyThisMix.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center items-center  text-center space-y-4">
          <PrimaryButton
            text={t("InvestmentPlan.actions.continueConfirm")}
            onClick={() => {}}
            className="!w-fit px-4 font-medium text-lg"
          />
          <div>
            <button className="text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-custom-blue-100 hover:to-custom-blue-100 font-semibold">
              {t("InvestmentPlan.actions.customizeInvestments")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
