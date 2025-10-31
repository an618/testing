import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const allData = [
  { month: 'Jan', employee: 35000, employer: 54000 },
  { month: 'Feb', employee: 37000, employer: 52000 },
  { month: 'Mar', employee: 39000, employer: 50000 },
  { month: 'Apr', employee: 32000, employer: 57000 },
  { month: 'May', employee: 30000, employer: 59000 },
  { month: 'Jun', employee: 42000, employer: 50000 },
  { month: 'Jul', employee: 41000, employer: 51000 },
  { month: 'Aug', employee: 36000, employer: 56000 },
  { month: 'Sep', employee: 31000, employer: 60000 },
  { month: 'Oct', employee: 48000, employer: 62000 },
  { month: 'Nov', employee: 35000, employer: 54000 },
  { month: 'Dec', employee: 34000, employer: 53000 },
];

const EMPLOYEE_COLOR = '#4F5DFF';
const EMPLOYER_COLOR = '#D1D5F6';

const filters = ["ALL", "1M", "6M", "1Y", "YTD"];

function getFilteredData(filter: string) {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  if (filter === 'ALL' || filter === '1Y') return allData;
  if (filter === '1M') return [allData[allData.length - 1]];
  if (filter === '6M') return allData.slice(-6);
  if (filter === 'YTD') return allData.slice(0, currentMonth + 1);
  return allData;
}

export function ContributionsBarChart() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('ALL');
  const data = getFilteredData(selected);

  const filterLabels = {
    'ALL': t('ContributionsBarChart.filters.all'),
    '1M': t('ContributionsBarChart.filters.oneMonth'),
    '6M': t('ContributionsBarChart.filters.sixMonths'),
    '1Y': t('ContributionsBarChart.filters.oneYear'),
    'YTD': t('ContributionsBarChart.filters.ytd'),
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-semibold text-[#081021]">{t('ContributionsBarChart.title')}</span>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full border text-xs font-semibold transition-colors duration-150 ${selected === f ? 'bg-[#081021] text-white border-[#081021]' : 'bg-white text-[#081021] border-[#E5E7EB]'}`}
              onClick={() => setSelected(f)}
            >
              {filterLabels[f as keyof typeof filterLabels]}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barCategoryGap={40} barGap={0} barSize={48}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#081021', fontWeight: 500, fontSize: 15 }} />
          <Tooltip
            cursor={{ fill: '#F6F8FC' }}
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div className="bg-white rounded-xl shadow px-3 py-2 border border-gray-100">
                  <div className="text-xs text-[#081021] font-semibold mb-1">{payload[0].payload.month}</div>
                  <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: EMPLOYEE_COLOR }} />
                    <span className="text-xs text-[#4F5DFF] font-semibold">${payload[0].value.toLocaleString()}</span>
                    <span className="text-xs text-[#64748B] ml-1">{t('ContributionsBarChart.tooltip.proposedEmployee')}</span>
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: EMPLOYER_COLOR }} />
                    <span className="text-xs text-[#64748B] font-semibold">${payload[1].value.toLocaleString()}</span>
                    <span className="text-xs text-[#64748B] ml-1">{t('ContributionsBarChart.tooltip.proposedEmployer')}</span>
                  </div>
                </div>
              ) : null
            }
          />
          <Bar dataKey="employee" stackId="a" radius={[0, 0, 0, 0]} fill={EMPLOYEE_COLOR} />
          <Bar dataKey="employer" stackId="a" radius={[8, 8, 0, 0]} fill={EMPLOYER_COLOR} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-6">
        <div className="flex flex-col items-center">
          <span className="text-[#4F5DFF] font-bold text-lg">$89,500</span>
          <span className="text-[#64748B] text-xs mt-1">{t('ContributionsBarChart.summary.proposedEmployee')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#64748B] font-bold text-lg">$89,500</span>
          <span className="text-[#64748B] text-xs mt-1">{t('ContributionsBarChart.summary.proposedEmployer')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#4F5DFF] font-bold text-lg">$92,000</span>
          <span className="text-[#64748B] text-xs mt-1">{t('ContributionsBarChart.summary.ytdEmployee')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#64748B] font-bold text-lg">$95,200</span>
          <span className="text-[#64748B] text-xs mt-1">{t('ContributionsBarChart.summary.ytdEmployer')}</span>
        </div>
      </div>
    </div>
  );
} 