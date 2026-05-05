export const getHighlightJobQuota = (featureUsage = []) =>
  featureUsage.find((item) => item?.featureKey === "HIGHLIGHT_JOB");

export const getHighlightJobQuotaState = (featureUsage = []) => {
  const quota = getHighlightJobQuota(featureUsage);
  const maxQuota = Number(quota?.maxQuota ?? 0);
  const used = Number(quota?.used ?? 0);
  const isIncluded = Boolean(quota);
  const isAtLimit = isIncluded && used >= maxQuota;
  const isNearLimit = isIncluded && maxQuota > 0 && !isAtLimit && used / maxQuota >= 0.8;

  return {
    quota,
    maxQuota,
    used,
    remaining: isIncluded ? Math.max(0, maxQuota - used) : 0,
    isIncluded,
    isAtLimit,
    isNearLimit,
  };
};

export const getHighlightJobUnavailableMessage = (featureUsage = []) => {
  const { isIncluded, isAtLimit } = getHighlightJobQuotaState(featureUsage);

  if (!isIncluded) {
    return "Your current plan does not include highlighted job slots.";
  }

  if (isAtLimit) {
    return "Your company has used all highlighted job slots. Turn off highlight on another live job or upgrade your plan.";
  }

  return null;
};

export const getPublishHighlightErrorMessage = (
  error,
  { wantsHighlight = false, featureUsage = [] } = {}
) => {
  const serverMessage = error?.data?.message;

  if (!wantsHighlight || !serverMessage) {
    return serverMessage;
  }

  if (Array.isArray(featureUsage) && featureUsage.length > 0) {
    const unavailableMessage = getHighlightJobUnavailableMessage(featureUsage);
    if (unavailableMessage) {
      return unavailableMessage;
    }
  }

  if (serverMessage.includes("Highlight Job Slot")) {
    return "Your company has used all highlighted job slots. Turn off highlight on another live job or upgrade your plan.";
  }

  return serverMessage;
};
