import { useMemo, useState } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TYPES, PLAN_TARGETS } from "@/constrant/plan";
import Plans from "./plans";
import Addons from "./addons";
import Loading from "@/components/Loading";
import PaymentModal from "@/pages/checkout/components/PaymentModal";
import { Tabs, ConfigProvider } from "antd";

const BillingPlans = () => {
  const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useGetPlansQuery({
    planType: PLAN_TYPES.MAIN,
    planTarget: PLAN_TARGETS.COMPANY,

  });

  const { data: addons = [], isLoading: isAddonsLoading, refetch: refetchAddons } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_QUOTA,
    planTarget: PLAN_TARGETS.COMPANY,
  });
  const { data: addonsFeature = [], isLoading: isAddonsFeatureLoading, refetch: refetchAddonsFeature } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_FEATURE,
    planTarget: PLAN_TARGETS.COMPANY,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [selectedDurationForPayment, setSelectedDurationForPayment] = useState(null);

  const handleOpenPaymentModal = (plan, duration) => {
    setSelectedPlanForPayment(plan);
    setSelectedDurationForPayment(duration);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlanForPayment(null);
    setSelectedDurationForPayment(null);
  };

  const handlePaymentSuccess = () => {
    refetchPlans();
    refetchAddons();
    refetchAddonsFeature();
  };

  const currentPlan = useMemo(() => {
    if (!Array.isArray(plans)) return null;
    return plans.find((plan) => plan?.isCurrent) || null;
  }, [plans]);
  const currentPlanId = currentPlan?.id ?? null;
  const currentPlanName = currentPlan?.name;

  if (isPlansLoading || isAddonsLoading) {
    return <Loading />
  }

  const items = [
    {
      key: '1',
      label: 'Main Plans',
      children: (
        <div className="w-full">
          <Plans plans={plans} currentPlanId={currentPlanId} onOpenPaymentModal={handleOpenPaymentModal} />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Extras',
      children: (
        <div className="w-full">
          <Addons
            quotaPlans={addons}
            featurePlans={addonsFeature}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff6b00',
          },
        }}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </ConfigProvider>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedPlanForPayment}
        selectedDuration={selectedDurationForPayment}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BillingPlans;
