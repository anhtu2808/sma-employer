import { useMemo } from "react";
import { Col, Row } from "antd";
import { useGetFeatureUsageQuery } from "@/apis/featureUsageApi";
import Header from "./header";
import Quota from "./quota";
import Table from "./table";

const mapQuotas = (quotas) => {
  if (!Array.isArray(quotas)) return [];
  return quotas
    .filter((quota) => quota?.usageType !== "BOOLEAN" && quota?.maxQuota != null)
    .map((quota) => ({
      key: quota?.featureKey || String(quota?.featureId ?? ""),
      label: quota?.featureName || quota?.featureKey || "Quota",
      used: Number(quota?.used ?? 0),
      total: Number(quota?.maxQuota ?? 0),
    }))
    .filter((quota) => quota.key);
};

const Usage = () => {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

  const {
    data: featureUsage = [],
    isLoading: isQuotaLoading,
    isError: isQuotaError,
  } = useGetFeatureUsageQuery(undefined, {
    skip: !hasAccessToken,
  });

  const quotas = useMemo(() => mapQuotas(featureUsage), [featureUsage]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Header />
      </Col>

      <Col span={24}>
        <Quota quotas={quotas} isQuotaLoading={isQuotaLoading} isQuotaError={isQuotaError} />
      </Col>

      <Col span={24}>
        <Table />
      </Col>
    </Row>
  );
};

export default Usage;
