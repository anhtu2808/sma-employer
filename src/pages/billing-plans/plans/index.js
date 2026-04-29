import { useEffect, useMemo, useState } from "react";
import PlanCard from "./plan-card";
import formatCurrency from "@/utils/formatCurrency";


const isLifetimeUnit = (unit) => String(unit || "").toUpperCase() === "LIFETIME";

const toMonths = (duration, unit) => {
  if (!duration || !unit) return 0;
  if (isLifetimeUnit(unit)) return 0;
  return unit === "YEAR" ? duration * 12 : duration;
};

const mapPlanToCard = (plan, currentPlanId, currentLevel) => {
  const planPrices = Array.isArray(plan?.planPrices) ? plan.planPrices : [];
  const lifetimePrice = planPrices.find(
    (price) => price?.isActive !== false && isLifetimeUnit(price?.unit)
  );
  const name = plan?.name || "Plan";
  const code = name ? name.toUpperCase().replace(/\s+/g, "_") : `PLAN_${plan?.id ?? ""}`;
  const isCurrent =
    currentPlanId != null ? plan?.id === currentPlanId : Boolean(plan?.isCurrent);
  const description = plan?.description || "";
  const detailsHtml = typeof plan?.planDetails === "string" ? plan.planDetails.trim() : "";
  const isPopular = Boolean(plan?.isPopular);
  const isDowngrade = !isCurrent && plan?.planLevel > currentLevel;
  if (lifetimePrice) {
    const total = Number(lifetimePrice.salePrice ?? lifetimePrice.originalPrice ?? 0);
    const currency = "VND";
    const priceLabel = total === 0 ? "Free" : formatCurrency(total);
    const note = total === 0 ? "Lifetime access" : "Billed once";
    return {
      id: plan?.id,
      code,
      name,
      description,
      current: isCurrent,
      isDowngrade,
      popular: isPopular,
      basePriceLabel: priceLabel,
      baseUnit: "",
      note,
      cta: isCurrent ? "Current Plan" : `Upgrade to ${name}`,
      detailsHtml,
      durations: [],
    };
  }
  const pricesWithMonths = planPrices
    .filter((price) => price?.isActive !== false)
    .map((price) => ({
      id: price.id,
      months: toMonths(price.duration, price.unit),
      total: Number(price.salePrice ?? price.originalPrice ?? 0),
      currency: "VND",
      unit: price.unit,
    }))
    .filter((price) => price.months > 0);

  pricesWithMonths.sort((a, b) => a.months - b.months);

  const basePrice = pricesWithMonths[0] || null;
  const baseMonthly =
    basePrice && basePrice.months > 0 ? basePrice.total / basePrice.months : 0;

  const durations = pricesWithMonths.map((price) => {
    const monthly = price.months > 0 ? price.total / price.months : 0;
    const savePercent =
      baseMonthly > 0 ? Math.max(0, Math.round((1 - monthly / baseMonthly) * 100)) : 0;
    return {
      key: String(price.id ?? `${plan.id}-${price.months}m`),
      months: price.months,
      total: formatCurrency(price.total),
      monthly: `${formatCurrency(monthly)} / month`,
      savePercent,
    };
  });

  const maxSave = durations.reduce((max, item) => Math.max(max, item.savePercent || 0), 0);
  const durationsWithPopular = durations.map((item) => ({
    ...item,
    mostPopular: item.savePercent === maxSave && maxSave > 0,
  }));

  const note =
    durationsWithPopular.length > 1
      ? "Billed monthly or save on longer terms"
      : basePrice
        ? basePrice.unit === "YEAR"
          ? "Billed yearly"
          : "Billed monthly"
        : "Pricing unavailable";

  return {
    id: plan?.id,
    code,
    name,
    description,
    current: isCurrent,
    popular: isPopular,
    basePriceLabel: basePrice ? formatCurrency(baseMonthly) : "-",
    baseUnit: "/ month",
    note,
    cta: isCurrent ? "Current Plan" : `Upgrade to ${name}`,
    detailsHtml,
    durations: durationsWithPopular,
  };
};

const Plans = ({ plans = [], currentPlanId = null, onOpenPaymentModal }) => {
  const [expandedPlanCode, setExpandedPlanCode] = useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState({});

  const sortedPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return [...plans].sort((a, b) => {
      const aDefault = Boolean(a?.isDefault);
      const bDefault = Boolean(b?.isDefault);
      if (aDefault !== bDefault) return aDefault ? -1 : 1;
      const aLevel = a?.planLevel ?? Number.MAX_SAFE_INTEGER;
      const bLevel = b?.planLevel ?? Number.MAX_SAFE_INTEGER;
      if (aLevel !== bLevel) return aLevel - bLevel;
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
  }, [plans]);
  const currentLevel = useMemo(() => {
    const currentPlan = plans.find(p => p.isCurrent === true || p.id === currentPlanId);
    return currentPlan?.planLevel ?? 0;
  }, [plans, currentPlanId]);
  const mappedPlans = useMemo(() => {
    return sortedPlans.map((plan) => {
      const cardData = mapPlanToCard(plan, currentPlanId);
      const isCurrent = plan.isCurrent || plan.id === currentPlanId;
      const isDowngrade = !isCurrent && plan.planLevel > currentLevel;

      return {
        ...cardData,
        isDowngrade: isDowngrade,
        cta: isCurrent ? "Current Plan" : isDowngrade ? `${plan.name}` : cardData.cta
      };
    });
  }, [sortedPlans, currentPlanId, currentLevel]);

  useEffect(() => {
    if (mappedPlans.length === 0) return;
    setSelectedDurationByPlan((prev) => {
      const next = { ...prev };
      for (const plan of mappedPlans) {
        if (!next[plan.code] && plan.durations.length > 0) {
          next[plan.code] = plan.durations[0].key;
        }
      }
      return next;
    });
  }, [mappedPlans]);

  const onSelectDuration = (planCode, durationKey) => {
    setSelectedDurationByPlan((prev) => ({ ...prev, [planCode]: durationKey }));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          Choose your plan
        </h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        {mappedPlans.map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            isSelected={selectedPlanCode === plan.code}
            onClick={() => setSelectedPlanCode(plan.code)}
            isExpanded={expandedPlanCode === plan.code}
            onExpand={() => setExpandedPlanCode(plan.code)}
            onClose={() => setExpandedPlanCode(null)}
            selectedDuration={selectedDurationByPlan[plan.code]}
            onSelectDuration={(durationKey) => onSelectDuration(plan.code, durationKey)}
            onOpenPaymentModal={onOpenPaymentModal}
          />
        ))}
      </div>
    </div>
  );
};

export default Plans;
