export const DEFAULT_MIN_SCORE = 30;
export const MIN_SCORE = 0;
export const MAX_SCORE = 100;

export const normalizeMinScore = (value) => {
  if (value == null || value === '') return DEFAULT_MIN_SCORE;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return DEFAULT_MIN_SCORE;
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(numericValue)));
};

export const normalizeOptionalMinScore = (value) => {
  if (value == null || value === '') return null;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return null;
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.ceil(numericValue)));
};

export const getRefreshMinScoreConstraint = ({ draftMinScore, autoRejectThreshold }) => {
  const lowerBound = normalizeOptionalMinScore(autoRejectThreshold);
  const normalizedDraftMinScore = normalizeMinScore(draftMinScore);
  const isEnabled = lowerBound != null && lowerBound > MIN_SCORE;
  const isValid = !isEnabled || normalizedDraftMinScore >= lowerBound;

  return {
    lowerBound: isEnabled ? lowerBound : MIN_SCORE,
    isEnabled,
    isValid,
    normalizedDraftMinScore,
    errorMessage: isValid
      ? null
      : `Minimum score must be at least ${lowerBound}% because candidates below the auto-reject threshold would be rejected automatically.`,
  };
};
