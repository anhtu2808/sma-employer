import React, { useState } from "react";
import { Progress, Tooltip } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGetCriteriaQuery } from "@/apis/jobApi";
import { CRITERIA_COLORS } from "@/constants/scoringColors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sparkles } from 'lucide-react';
import { faChevronDown, faChevronUp } from '../../../utils/icons';

const AiScoringCard = ({ job }) => {
  const { data: allCriteria = [] } = useGetCriteriaQuery();
  const [expandedRuleId, setExpandedRuleId] = useState(null);

  const isEnabled = job?.enableAiScoring === true;
  const scoringCriterias = job?.scoringCriterias || [];

  const enabledIds = new Set(scoringCriterias.map((sc) => sc.criteria?.id || sc.criteriaId));

  const disabledCriteria = allCriteria.filter((c) => !enabledIds.has(c.id));

  const totalWeight = scoringCriterias.reduce((sum, sc) => sum + (sc.weight || 0), 0);

  const chartData = scoringCriterias
    .filter((sc) => sc.weight > 0)
    .map((sc, i) => ({
      name: sc.criteria?.name || "Criteria",
      value: sc.weight,
      color: CRITERIA_COLORS[i % CRITERIA_COLORS.length],
    }));

  if (totalWeight < 100 && chartData.length > 0) {
    chartData.push({ name: "Remaining", value: 100 - totalWeight, color: "#E5E7EB" });
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles size={20} className="text-orange-500" />
          AI Scoring
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isEnabled
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {isEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {!isEnabled ? (
        <div className="text-center py-6 text-gray-400 dark:text-gray-500">
          <Sparkles size={30} className="mb-2 mx-auto" />
          <p className="text-sm">AI Scoring is not enabled for this job</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mini Donut */}
          {chartData.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={54}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">{totalWeight}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Enabled Criteria */}
          <div className="space-y-3">
            {scoringCriterias.map((sc, i) => {
              const name = sc.criteria?.name || "Criteria";
              const color = CRITERIA_COLORS[i % CRITERIA_COLORS.length];
              const hasRule = !!sc.rule;

              return (
                <div key={sc.id || i}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{name}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">{Math.round(sc.weight)}%</span>
                  </div>
                  <div className="mt-1 ml-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${sc.weight}%`, backgroundColor: color }} />
                    </div>
                  </div>
                  {hasRule && (
                    <div className="ml-4 mt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedRuleId(expandedRuleId === sc.id ? null : sc.id)}
                        className="text-[11px] text-gray-400 hover:text-orange-500 flex items-center gap-0.5"
                      >
                        <FontAwesomeIcon icon={expandedRuleId === sc.id ? faChevronUp : faChevronDown} className="text-[12px]" />
                        Custom rule
                      </button>
                      {expandedRuleId === sc.id && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          {sc.rule}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Disabled Criteria */}
            {disabledCriteria.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm opacity-40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full inline-block bg-gray-300" />
                  <span className="text-gray-400 line-through">{c.name}</span>
                </div>
                <span className="text-gray-400">--</span>
              </div>
            ))}
          </div>

          {/* Auto-Reject Threshold */}
          {job.autoRejectThreshold != null && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Reject Threshold</span>
                <Tooltip title="Candidates scoring below this threshold are automatically rejected">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                    Below {job.autoRejectThreshold}%
                  </span>
                </Tooltip>
              </div>
              <Progress
                percent={job.autoRejectThreshold}
                strokeColor="#F97316"
                trailColor="#E5E7EB"
                showInfo={false}
                size="small"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Below {job.autoRejectThreshold}% auto-rejected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiScoringCard;
