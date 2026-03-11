import React from "react";
import { Slider, Form, Switch, Checkbox, Tooltip } from "antd";
import { useGetCriteriaQuery } from "@/apis/jobApi";
import Loading from "@/components/Loading";

const ScoringWeights = () => {
  const { data: criteriaRes, isLoading } = useGetCriteriaQuery();
  const criteriaList = criteriaRes?.data || [];

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => {
        // Update if AI scoring toggle changes
        if (prevValues.enableAiScoring !== currentValues.enableAiScoring) return true;

        // Update if any criteria enable or weight changes
        for (const criteriaItem of criteriaList) {
          if (prevValues[`enable_${criteriaItem.id}`] !== currentValues[`enable_${criteriaItem.id}`]) return true;
          if (prevValues[`weight_${criteriaItem.id}`] !== currentValues[`weight_${criteriaItem.id}`]) return true;
        }
        if (prevValues.autoRejectThreshold !== currentValues.autoRejectThreshold) return true;
        return false;
      }}
    >
      {({ getFieldValue, setFieldsValue }) => {
        const isAiActive = getFieldValue("enableAiScoring") !== false;

        // If AI is inactive, we automatically turn off all criteria checkboxes
        // If AI is turned back active, we reset them to default values
        const updates = {};
        let needsUpdate = false;

        if (!isAiActive) {
          criteriaList.forEach((criteria) => {
            if (getFieldValue(`enable_${criteria.id}`) !== false) {
              updates[`enable_${criteria.id}`] = false;
              needsUpdate = true;
            }
          });
        } else {
          // Check if we need to reset to defaults. We know it was just turned on if some flag indicates it,
          // but we can simply check if ALL criteria are currently disabled (which is the state it's in when AI is off).
          // If all are disabled, and AI is active, it means it was just turned on.
          const allDisabled = criteriaList.every((c) => getFieldValue(`enable_${c.id}`) === false);
          if (allDisabled && criteriaList.length > 0) {
            criteriaList.forEach((criteria) => {
              updates[`enable_${criteria.id}`] = true;
              updates[`weight_${criteria.id}`] = criteria.defaultWeight;
              needsUpdate = true;
            });
          }
        }

        if (needsUpdate) {
          setTimeout(() => {
            setFieldsValue(updates);
          }, 0);
        }

        // Calculate total weight based on enabled criteria
        let currentTotalWeight = 0;
        if (isAiActive) {
          criteriaList.forEach((criteriaItem) => {
            const isEnabled = getFieldValue(`enable_${criteriaItem.id}`) !== false;
            const weight = getFieldValue(`weight_${criteriaItem.id}`) || 0;
            if (isEnabled) {
              currentTotalWeight += weight;
            }
          });
        }

        // Ensure we don't exceed 100 if something gets enabled
        if (currentTotalWeight > 100) {
          // We might want to auto-adjust, but for now just showing it exceeds is okay,
          // or we can prevent the slider from moving past the available limit.
        }

        const isOver100 = currentTotalWeight > 100;
        const remainingWeight = Math.max(0, 100 - currentTotalWeight);

        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">
                  psychology
                </span>
                AI Scoring Weights
              </h3>
              <Form.Item
                name="enableAiScoring"
                valuePropName="checked"
                initialValue={true}
                noStyle
                shouldUpdate={(prevValues, currentValues) => {
                  return criteriaList.some(
                    (item) => prevValues[`weight_${item.id}`] !== currentValues[`weight_${item.id}`]
                  );
                }}
              >
                <Switch
                  checkedChildren="AI Active"
                  unCheckedChildren="AI Off"
                  className={isAiActive ? "bg-orange-500" : "bg-gray-400"}
                />
              </Form.Item>
            </div>

            <div
              className={`space-y-6 transition-all duration-300 ${!isAiActive ? "opacity-50 grayscale pointer-events-none" : ""
                }`}
            >
              <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total Allocated Weight:</span>
                <span className={`text-sm font-bold ${isOver100 ? 'text-red-500' : currentTotalWeight === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                  {currentTotalWeight}% / 100%
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loading inline size={76} />
                </div>
              ) : (
                criteriaList.map((criteriaItem) => {
                  const isEnabled = getFieldValue(`enable_${criteriaItem.id}`) !== false;
                  const currentWeight = getFieldValue(`weight_${criteriaItem.id}`) || 0;

                  // Limit the highest value this slider can be dragged to based on remaining available weight.
                  // It can go up to its current value + whatever is left to reach 100.
                  const maxAllowed = isEnabled ? Math.min(100, currentWeight + remainingWeight) : 100;

                  return (
                    <div key={criteriaItem.id} className={`${!isEnabled ? "opacity-50" : ""}`}>
                      <div className="flex justify-between mb-1 text-sm items-center">
                        <div className="flex items-center gap-2">
                          <Form.Item
                            name={`enable_${criteriaItem.id}`}
                            valuePropName="checked"
                            initialValue={true}
                            noStyle
                          >
                            <Checkbox
                              disabled={!isAiActive || (!isEnabled && maxAllowed < currentWeight)}
                              onChange={(e) => {
                                // If enabling, and current weight would push it over 100, reduce it
                                if (e.target.checked) {
                                  if (currentWeight > remainingWeight) {
                                    setFieldsValue({ [`weight_${criteriaItem.id}`]: remainingWeight });
                                  }
                                }
                              }}
                            />
                          </Form.Item>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {criteriaItem.name}
                          </span>
                        </div>
                        <span className="text-orange-500 font-medium">
                          {isEnabled ? `${currentWeight}%` : '0%'}
                        </span>
                      </div>
                      <Form.Item
                        name={`weight_${criteriaItem.id}`}
                        initialValue={criteriaItem.defaultWeight}
                        noStyle
                      >
                        <Slider
                          trackStyle={{ backgroundColor: "#F97316" }}
                          handleStyle={{
                            borderColor: "#F97316",
                            backgroundColor: "#F97316",
                          }}
                          disabled={!isAiActive || !isEnabled}
                          max={100}
                          onChange={(val) => {
                            // Ensure the value doesn't exceed the max allowed based on remaining capacity
                            if (val > maxAllowed) {
                              setFieldsValue({ [`weight_${criteriaItem.id}`]: maxAllowed });
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                  );
                })
              )}

              {/* Auto-Reject Threshold */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-Reject Threshold
                  </label>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded flex items-center gap-1">
                    {isAiActive ? (
                      <>
                        <Tooltip title="This is the percentage scale used to automatically reject CVs with matching scores lower than the set threshold.">
                          <span className="material-icons-round text-[14px] cursor-help">error_outline</span>
                        </Tooltip>
                        <span>Below {getFieldValue('autoRejectThreshold') || 40}%</span>
                      </>
                    ) : (
                      'Disabled'
                    )}
                  </span>
                </div>

                <Form.Item name="autoRejectThreshold" noStyle initialValue={40}>
                  <Slider
                    trackStyle={{ backgroundColor: '#F97316' }}
                    handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }}
                    disabled={!isAiActive}
                    onChange={(val) => {
                      // Logic to set threshold based on AI state is handled in the effect below
                    }}
                  />
                </Form.Item>
                <p className="text-xs text-gray-500 mt-1">
                  {isAiActive
                    ? "Candidates scoring below this will be automatically moved to 'Rejected'."
                    : "AI Scoring is disabled. Candidates will not be auto-rejected."}
                </p>
              </div>

              {/* Effect to sync threshold with AI state */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.enableAiScoring !== currentValues.enableAiScoring ||
                  prevValues.autoRejectThreshold !== currentValues.autoRejectThreshold
                }
              >
                {({ getFieldValue, setFieldsValue }) => {
                  const aiActive = getFieldValue('enableAiScoring') !== false;
                  const threshold = getFieldValue('autoRejectThreshold');

                  if (!aiActive && threshold !== 0) {
                    setTimeout(() => setFieldsValue({ autoRejectThreshold: 0 }), 0);
                  } else if (aiActive && threshold === 0) {
                    setTimeout(() => setFieldsValue({ autoRejectThreshold: 40 }), 0);
                  }
                  return null;
                }}
              </Form.Item>
            </div>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default ScoringWeights;
