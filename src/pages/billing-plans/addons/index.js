import Button from "@/components/Button";

const formatCurrency = (amount) => {
  if (amount == null || Number.isNaN(Number(amount))) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

const Addons = ({ quotaPlans = [], featurePlans = [], onOpenPaymentModal }) => {
  if (quotaPlans.length === 0 && featurePlans.length === 0) return null;

  const renderAddonItem = (addon) => {
    const prices = Array.isArray(addon?.planPrices) ? addon.planPrices : [];
    const priceObj = prices.find((p) => p?.isActive !== false) || {};
    const priceAmount = priceObj.salePrice ?? priceObj.originalPrice ?? 0;
    const isAdded = Boolean(addon.isCurrent);

    const usageLimits = addon?.usageLimits || [];
    const isFeature = addon.planType === "ADDONS_FEATURE";
    const handleAddonClick = (addon, priceObj) => {
      const addonPlan = {
        id: addon.id,
        name: addon.name,
        description: addon.description,
        basePriceLabel: formatCurrency(priceObj.salePrice ?? priceObj.originalPrice ?? 0),
        baseUnit: "",
        priceId: priceObj.id,
        durations: [],
      };
      onOpenPaymentModal(addonPlan, null);
    };
    return (
      <div key={addon.id} className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-sm transition-all group">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{addon.name}</h4>
            {isAdded && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Active</span>}
          </div>
          <p className="text-xs text-gray-500">{addon.description}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {usageLimits.map((limit, i) => (
              <span key={i} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>
                {limit.featureName}: +{limit.maxQuota}
              </span>
            ))}

          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm font-bold text-gray-900">
            {priceAmount > 0 ? `+${formatCurrency(priceAmount)}` : "Free"}
          </span>
          <Button
            mode={isAdded ? "secondary" : "primary"}
            className="!py-1.5 !px-4 !text-xs !font-bold"
            onClick={() => handleAddonClick(addon, priceObj)}
          >
            {isAdded ? "Manage" : "Add to plan"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-8">
      <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Add-ons
      </h2>

      <div className="space-y-10">
        {quotaPlans.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 ml-1">Usage Quotas</h3>
            <div className="grid grid-cols-1 gap-3">
              {quotaPlans.map(renderAddonItem)}
            </div>
          </div>
        )}

        {featurePlans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold text-gray-500 ml-1">Premium Features</h3>
              <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {featurePlans.map(renderAddonItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addons;
