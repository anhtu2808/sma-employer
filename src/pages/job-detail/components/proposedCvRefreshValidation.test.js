import { getRefreshMinScoreConstraint } from './proposedCvRefreshValidation';

describe('getRefreshMinScoreConstraint', () => {
  it('treats a null auto-reject threshold as disabled', () => {
    expect(getRefreshMinScoreConstraint({
      draftMinScore: 30,
      autoRejectThreshold: null,
    })).toMatchObject({
      lowerBound: 0,
      isEnabled: false,
      isValid: true,
      errorMessage: null,
    });
  });

  it('treats a zero auto-reject threshold as disabled', () => {
    expect(getRefreshMinScoreConstraint({
      draftMinScore: 10,
      autoRejectThreshold: 0,
    })).toMatchObject({
      lowerBound: 0,
      isEnabled: false,
      isValid: true,
      errorMessage: null,
    });
  });

  it('rejects a draft score below the auto-reject threshold', () => {
    expect(getRefreshMinScoreConstraint({
      draftMinScore: 30,
      autoRejectThreshold: 40,
    })).toMatchObject({
      lowerBound: 40,
      isEnabled: true,
      isValid: false,
    });
  });

  it('allows a draft score equal to the auto-reject threshold', () => {
    expect(getRefreshMinScoreConstraint({
      draftMinScore: 40,
      autoRejectThreshold: 40,
    })).toMatchObject({
      lowerBound: 40,
      isEnabled: true,
      isValid: true,
      errorMessage: null,
    });
  });

  it('allows a draft score above the auto-reject threshold', () => {
    expect(getRefreshMinScoreConstraint({
      draftMinScore: 55,
      autoRejectThreshold: 40,
    })).toMatchObject({
      lowerBound: 40,
      isEnabled: true,
      isValid: true,
      errorMessage: null,
    });
  });
});
