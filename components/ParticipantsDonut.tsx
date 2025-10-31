import { PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

// const data = [
//   { name: 'Active', value: 80 },
//   { name: 'Inactive', value: 20 },
// ];

const COLORS = ['#4F5DFF', '#D1D5F6'];

export function ParticipantsDonut() {
  const { t } = useTranslation();

  const translatedData = [
    { name: t('ParticipantsDonut.active'), value: 80 },
    { name: t('ParticipantsDonut.inactive'), value: 20 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center w-full h-full min-w-[220px] min-h-[220px]">
      <div className="text-lg font-semibold text-[#081021] mb-2 w-full text-left">{t('ParticipantsDonut.title')}</div>
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <PieChart width={140} height={140}>
          <Pie
            data={translatedData}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={65}
            startAngle={210}
            endAngle={-30}
            dataKey="value"
            stroke="none"
          >
            {translatedData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-[#94A3B8]">{t('ParticipantsDonut.percentage')}</span>
        </div>
      </div>
      <div className="text-[#64748B] text-base font-medium mt-2">{t('ParticipantsDonut.count')}</div>
    </div>
  );
} 