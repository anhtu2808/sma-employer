import { toLocalDateTimeParam } from "@/utils/dateTimeUtils";

export const FEATURE_USAGE_DATE_PRESETS = [
  { key: 7, label: "Last 7 Days" },
  { key: 30, label: "Last 30 Days" },
  { key: 90, label: "Last 90 Days" },
];

export const DEFAULT_FEATURE_USAGE_PAGE_SIZE = 10;
export const DEFAULT_FEATURE_USAGE_PRESET_DAYS = 30;

export const getDateRangeByPreset = (days, now = new Date()) => {
  const endDate = now instanceof Date ? new Date(now) : new Date(now);
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
};

export const buildFeatureUsageHistoryParams = ({
  page = 0,
  size = DEFAULT_FEATURE_USAGE_PAGE_SIZE,
  selectedPreset = DEFAULT_FEATURE_USAGE_PRESET_DAYS,
  featureKey,
  eventSource,
  sourceId,
  now = new Date(),
} = {}) => {
  const { startDate, endDate } = getDateRangeByPreset(selectedPreset, now);

  return {
    page,
    size,
    startDate: toLocalDateTimeParam(startDate),
    endDate: toLocalDateTimeParam(endDate),
    ...(featureKey ? { featureKey } : {}),
    ...(eventSource ? { eventSource } : {}),
    ...(sourceId != null ? { sourceId } : {}),
  };
};
