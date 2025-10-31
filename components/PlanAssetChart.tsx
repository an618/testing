import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { useTranslation } from 'react-i18next';
import { TooltipIndex } from 'recharts/types/state/tooltipSlice';

const data = [
  { time: '1:00AM', value: 120 },
  { time: '2:00AM', value: 350 },
  { time: '3:00AM', value: 180 },
  { time: '3:59AM', value: 376 },
  { time: '5:00AM', value: 90 },
  { time: '6:00AM', value: 400 },
  { time: '7:00AM', value: 220 },
  { time: '8:00AM', value: 420 },
  { time: '9:00AM', value: 150 },
  { time: '10:00AM', value: 410 },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { month: string; } }> }) {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow px-3 py-1 flex items-center gap-2 border border-gray-100">
        <span className="inline-block w-2 h-2 rounded-full bg-[#3B5BFE]" />
        <span className="text-[#081021] font-semibold text-base">{t('PlanAssetChart.tooltip.value', { value: `$${payload[0].value}` })}</span>
      </div>
    );
  }
  return null;
}

// Custom X axis tick: only show first, highlight, and last
function CustomTick(props: { x?: number; y?: number; payload?: { index?: number; value?: string } }) {
  const { x, y, payload } = props;
  const highlightTime = '3:59AM';
  const isFirst = payload?.index === 0;
  const isLast = payload?.index === data.length - 1;
  const isHighlight = payload?.value === highlightTime;
  if (!isFirst && !isLast && !isHighlight) return null;
  return (
    <text x={x} y={y ? y + 16 : 0} textAnchor="middle" fill="#94A3B8" fontSize={12} fontWeight={500}>
      {payload?.value}
    </text>
  );
}

export function PlanAssetChart() {
  const { t } = useTranslation();
  const chartData = useMemo(() => data.map((d, i) => ({ ...d, index: i })), []);
  const defaultIndex = 3; // 3:59AM
  const [hoveredIndex, setHoveredIndex] = useState<number | TooltipIndex | undefined>(undefined);
  const highlight = hoveredIndex !== undefined && hoveredIndex !== null ? chartData[Number(hoveredIndex)] : chartData[defaultIndex];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ minHeight: 220 }}>
      <div className="mb-2">
        <div className="text-lg font-semibold text-[#6C3DF4]">{t('PlanAssetChart.title')}</div>
        <div className="text-xs text-[#6C3DF4] font-medium">{t('PlanAssetChart.value')}</div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          onMouseMove={(state: unknown) => {
            const s = state as { activeTooltipIndex?: number };
            if (s && s.activeTooltipIndex !== undefined && s.activeTooltipIndex !== null) {
              if (hoveredIndex !== s.activeTooltipIndex) {
                setHoveredIndex(s.activeTooltipIndex);
              }
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
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
          <Line
            type="linear"
            dataKey="value"
            stroke="#6C3DF4"
            strokeWidth={2.5}
            dot={false}
            activeDot={false}
            strokeLinejoin="miter"
            strokeLinecap="square"
            animationDuration={0}
          />
          {/* Highlighted dot and vertical line at hovered point or default */}
          <ReferenceLine x={highlight.time} stroke="#6C3DF4" strokeDasharray="" strokeWidth={1} />
          <ReferenceDot
            x={highlight.time}
            y={highlight.value}
            r={6}
            fill="#6C3DF4"
            stroke="#fff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs text-[#94A3B8] mt-2 ml-2">
        {/* Show hovered time or default */}
        {highlight.time}
      </div>
    </div>
  );
} 