import { useMemo } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TYPES, PLAN_TARGETS } from "@/constrant/plan";
import Plans from "./plans";
import Addons from "./addons";
import Loading from "@/components/Loading";

const BillingPlans = () => {
  const { data: plans = [], isLoading: isPlansLoading } = useGetPlansQuery({
    planType: PLAN_TYPES.MAIN,
    planTarget: PLAN_TARGETS.COMPANY,
  });

  const { data: addons = [], isLoading: isAddonsLoading } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_QUOTA,
    planTarget: PLAN_TARGETS.COMPANY,
  });

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
        <Plans plans={plans} currentPlanId={currentPlanId} />
      </div>

      <div className="w-full">
        <Addons plans={addons} />
      </div>
    </div>
  );
};

export default BillingPlans;
