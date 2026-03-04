import { useMemo } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import Plans from "./plans";
import { usePageHeader } from "@/hooks/usePageHeader";
import Loading from "@/components/Loading";

const BillingPlans = () => {
  usePageHeader("Billing & Plans", "Manage your subscription plans and billing details.");
  const { data: plans = [], isLoading: isPlansLoading } = useGetPlansQuery();

  const currentPlan = useMemo(() => {
    if (!Array.isArray(plans)) return null;
    return plans.find((plan) => plan?.isCurrent) || null;
  }, [plans]);
  const currentPlanId = currentPlan?.id ?? null;
  const currentPlanName = currentPlan?.name;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="w-full">
            <div className="h-full rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-primary shadow-sm">
                    <span className="material-icons-round text-[26px]">star</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentPlanName ? `You're on ${currentPlanName}` : "Your current plan"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentPlanId ? "Manage or upgrade your plan anytime." : "Plan info will appear here."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-orange-100">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition-all shadow-sm"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="w-full">
        {isPlansLoading ? <Loading size={96} className="py-8" /> : <Plans plans={plans} currentPlanId={currentPlanId} />}
      </div>
    </div>
  );
};

export default BillingPlans;
