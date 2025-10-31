"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import { useTranslation } from "react-i18next";
import { TooltipIndex } from "recharts/types/state/tooltipSlice";

const data = [
  { time: "1:00AM", value: 120 },
  { time: "2:00AM", value: 350 },
  { time: "3:00AM", value: 180 },
  { time: "3:59AM", value: 376 },
  { time: "5:00AM", value: 90 },
  { time: "6:00AM", value: 400 },
  { time: "7:00AM", value: 220 },
  { time: "8:00AM", value: 420 },
  { time: "9:00AM", value: 150 },
  { time: "10:00AM", value: 410 },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { time: string } }>;
}) {
  const { t } = useTranslation();

  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow px-3 py-2 flex flex-col gap-1 border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-custom-tooltip-dot" />
          <span className="text-custom-tooltip-text font-semibold text-base">
            {t("TotalRetirementSavingCard.tooltip.value", {
              value: `$${payload[0].value}`,
            })}
          </span>
        </div>
        <div className="text-xs text-custom-tooltip-time ml-4">
          {payload[0].payload.time}
        </div>
      </div>
    );
  }
  return null;
}

// Custom X axis tick: hide all labels by default (only show on hover)
function CustomTick() {
  // Hide all x-axis labels by default
  return null;
}

export function TotalRetirementSavingCard() {
  const { t } = useTranslation();
  const chartData = useMemo(() => data.map((d, i) => ({ ...d, index: i })), []);
  const [hoveredIndex, setHoveredIndex] = useState<
    number | TooltipIndex | undefined
  >(undefined);
  const highlight =
    hoveredIndex !== undefined && hoveredIndex !== null
      ? chartData[Number(hoveredIndex)]
      : null;

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-5 py-4">
        <h3 className="text-xl font-medium text-custom-gray-700 mb-2">
          {t("TotalRetirementSavingCard.title")}
        </h3>
        <div className="text-sm font-medium text-custom-tertiary-100 mb-3">
          {t("TotalRetirementSavingCard.value")}
        </div>
      </div>
      {/* Integrated Chart */}
      <div className="flex-1 px-5 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(state: unknown) => {
              const s = state as { activeTooltipIndex?: number };
              if (
                s &&
                s.activeTooltipIndex !== undefined &&
                s.activeTooltipIndex !== null
              ) {
                if (hoveredIndex !== s.activeTooltipIndex) {
                  setHoveredIndex(s.activeTooltipIndex);
                }
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--custom-tertiary-100)"
                  stopOpacity="1"
                />
                <stop
                  offset="82.92%"
                  stopColor="rgba(255, 255, 255, 0)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={<CustomTick />}
              minTickGap={20}
              padding={{ left: 10, right: 10 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              wrapperStyle={{ zIndex: 20 }}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="var(--custom-chart-stroke)"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={false}
              strokeLinejoin="miter"
              strokeLinecap="square"
              animationDuration={0}
            />
            {/* Highlighted dot and vertical line only when hovering */}
            {highlight && (
              <>
                <ReferenceLine
                  x={highlight.time}
                  stroke="var(--custom-chart-stroke)"
                  strokeDasharray=""
                  strokeWidth={1}
                />
                <ReferenceDot
                  x={highlight.time}
                  y={highlight.value}
                  r={6}
                  fill="var(--custom-chart-stroke)"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
