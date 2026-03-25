import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { APPLICATION_STATUS } from '@/constrant/application';
import SectionHeader from './SectionHeader';

const PIPELINE_ORDER = ['APPLIED', 'VIEWED', 'SHORTLISTED', 'APPROVED', 'REJECTED'];

const BAR_COLORS = {
  APPLIED: '#9ca3af',
  VIEWED: '#6366f1',
  SHORTLISTED: '#ea580c',
  APPROVED: '#16a34a',
  REJECTED: '#dc2626',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, count, conversionRate } = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
      <p className="text-gray-500 dark:text-gray-400">{count} applications</p>
      {conversionRate !== null && (
        <p className="text-gray-500 dark:text-gray-400">{conversionRate}% from previous</p>
      )}
    </div>
  );
};

const PipelineSkeleton = () => (
  <div className="h-[260px] flex items-end gap-6 px-4 py-4">
    {[70, 50, 35, 25, 20].map((h, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2">
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse`} style={{ height: `${h}%` }} />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const ApplicationPipeline = ({ statusSummary, isLoading }) => {
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    if (!statusSummary?.statuses) return [];

    const statusMap = {};
    statusSummary.statuses.forEach(s => {
      statusMap[s.status] = s.count;
    });

    return PIPELINE_ORDER.map((status, index) => {
      const count = statusMap[status] || 0;
      const prevCount = index > 0 ? (statusMap[PIPELINE_ORDER[index - 1]] || 0) : null;
      const conversionRate = prevCount && prevCount > 0
        ? Math.round((count / prevCount) * 100)
        : null;

      return {
        status,
        name: APPLICATION_STATUS[status]?.label || status,
        count,
        conversionRate,
        color: BAR_COLORS[status],
      };
    });
  }, [statusSummary]);

  const handleBarClick = (data) => {
    if (data?.status) {
      navigate(`/applications?status=${data.status}`);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <SectionHeader title="Application Pipeline" linkTo="/applications" />
      {isLoading ? (
        <PipelineSkeleton />
      ) : chartData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-500 dark:text-gray-400">No application data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onClick={handleBarClick}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                style={{ fontSize: 13, fontWeight: 600, fill: '#374151' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationPipeline;
