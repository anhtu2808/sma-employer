import FeatureUsageHistoryTable from "@/components/FeatureUsageHistoryTable";
import { FEATURE_KEY } from "@/constrant";

const JobAiQuotaTab = ({ jobId }) => {
  const numericJobId = Number(jobId);

  return (
    <FeatureUsageHistoryTable
      featureKey={FEATURE_KEY.MATCHING_SCORE}
      eventSource="JOB"
      sourceId={Number.isNaN(numericJobId) ? undefined : numericJobId}
      skip={Number.isNaN(numericJobId)}
      emptyMessage="No AI quota consumption for this job in the selected date range."
    />
  );
};

export default JobAiQuotaTab;
