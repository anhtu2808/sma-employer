import { useEffect, useMemo, useState } from "react";
import { Dropdown, Empty } from "antd";
import { useGetFeatureUsageHistoryQuery } from "@/apis/featureUsageApi";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import { formatDateTime } from "@/utils/dateTimeUtils";
import {
  buildFeatureUsageHistoryParams,
  DEFAULT_FEATURE_USAGE_PAGE_SIZE,
  DEFAULT_FEATURE_USAGE_PRESET_DAYS,
  FEATURE_USAGE_DATE_PRESETS,
} from "@/utils/featureUsageHistory";

const FeatureUsageHistoryTable = ({
  featureKey,
  eventSource,
  sourceId,
  pageSize = DEFAULT_FEATURE_USAGE_PAGE_SIZE,
  defaultPreset = DEFAULT_FEATURE_USAGE_PRESET_DAYS,
  skip = false,
  emptyMessage = "No usage history in selected date range.",
}) => {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const [searchValue, setSearchValue] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [featureKey, eventSource, sourceId]);

  const historyParams = useMemo(
    () =>
      buildFeatureUsageHistoryParams({
        page,
        size: pageSize,
        selectedPreset,
        featureKey,
        eventSource,
        sourceId,
      }),
    [eventSource, featureKey, page, pageSize, selectedPreset, sourceId]
  );

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetFeatureUsageHistoryQuery(historyParams, {
    skip: skip || !hasAccessToken,
  });

  const historyContent = historyData?.content ?? [];
  const pageNumber = historyData?.pageNumber ?? 0;
  const totalPages = Math.max(1, historyData?.totalPages ?? 1);
  const datePresets = FEATURE_USAGE_DATE_PRESETS;

  return (
    <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <span className="material-icons-round text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Dropdown
          menu={{
            items: datePresets.map((preset) => ({
              key: preset.key.toString(),
              label: preset.label,
            })),
            selectable: true,
            selectedKeys: [selectedPreset.toString()],
            onClick: ({ key }) => {
              setSelectedPreset(Number(key));
              setPage(0);
            },
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="button" mode="secondary" shape="rounded" className="!px-4 !py-2 !text-sm">
            <span className="inline-flex items-center gap-2">
              {datePresets.find((preset) => preset.key === selectedPreset)?.label || "Select Range"}
              <span className="material-icons-round text-[16px]">expand_more</span>
            </span>
          </Button>
        </Dropdown>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Activity
              </th>
              <th className="px-6 py-4 text-center text-[13px] font-semibold text-gray-500 tracking-wider">
                Usage Count
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Plan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isHistoryLoading ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400" colSpan={4}>
                  Loading usage history...
                </td>
              </tr>
            ) : isHistoryError ? (
              <tr>
                <td className="px-6 py-10 text-sm text-red-500" colSpan={4}>
                  Failed to load usage history.
                </td>
              </tr>
            ) : historyContent.length === 0 ? (
              <tr>
                <td className="px-6 py-10" colSpan={4}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className="text-gray-500 dark:text-gray-400">{emptyMessage}</span>}
                  />
                </td>
              </tr>
            ) : (
              historyContent.map((item) => (
                <tr key={item?.id || `${item?.featureKey || "event"}-${item?.createdAt || ""}`}>
                  <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                    {formatDateTime(item?.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white">
                    {item?.featureName || "Unknown feature"}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200 font-mono text-center">
                    {Number(item?.amount ?? 0)}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                    {item?.planName || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      </div>
    </section>
  );
};

export default FeatureUsageHistoryTable;
