import { useMemo, useState } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TYPES, PLAN_TARGETS } from "@/constrant/plan";
import Plans from "./plans";
import Addons from "./addons";
import Loading from "@/components/Loading";
import PaymentModal from "@/pages/checkout/components/PaymentModal";

const BillingPlans = () => {
  const { data: plans = [], isLoading: isPlansLoading } = useGetPlansQuery({
    planType: PLAN_TYPES.MAIN,
    planTarget: PLAN_TARGETS.COMPANY,
  });

  const { data: addons = [], isLoading: isAddonsLoading } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_QUOTA,
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

  const currentPlan = useMemo(() => {
    if (!Array.isArray(plans)) return null;
    return plans.find((plan) => plan?.isCurrent) || null;
  }, [plans]);
  const currentPlanId = currentPlan?.id ?? null;
  const currentPlanName = currentPlan?.name;

  if (isPlansLoading || isAddonsLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <Plans plans={plans} currentPlanId={currentPlanId} onOpenPaymentModal={handleOpenPaymentModal} />
      </div>

      <div className="w-full">
        <Addons plans={addons} onOpenPaymentModal={handleOpenPaymentModal} />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedPlanForPayment}
        selectedDuration={selectedDurationForPayment}
      />
    </div>
  );
};

export default BillingPlans;
