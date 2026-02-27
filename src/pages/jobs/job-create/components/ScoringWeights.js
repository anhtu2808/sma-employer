import React from "react";
import { Slider, Form, Switch, Spin } from "antd";
import { useGetCriteriaQuery } from "@/apis/jobApi";

const ScoringWeights = () => {
  const { data: criteriaRes, isLoading } = useGetCriteriaQuery();
  const criteriaList = criteriaRes?.data || [];

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
        >
          <Switch
            checkedChildren="AI Active"
            unCheckedChildren="AI Off"
            className="bg-orange-500"
          />
        </Form.Item>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Spin />
          </div>
        ) : (
          <>
            {criteriaList.map((criteriaItem) => (
              <div key={criteriaItem.id}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {criteriaItem.name}
                  </span>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues[`weight_${criteriaItem.id}`] !== currentValues[`weight_${criteriaItem.id}`]}
                  >
                    {({ getFieldValue }) => {
                      const weight = getFieldValue(`weight_${criteriaItem.id}`);
                      return <span className="text-orange-500 font-medium">{`(${weight ?? criteriaItem.defaultWeight}%)`}</span>;
                    }}
                  </Form.Item>
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
                  />
                </Form.Item>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">Total Weight</span>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    return criteriaList.some(
                      (item) => prevValues[`weight_${item.id}`] !== currentValues[`weight_${item.id}`]
                    );
                  }}
                >
                  {({ getFieldValue }) => {
                    const total = criteriaList.reduce((sum, item) => {
                      const val = getFieldValue(`weight_${item.id}`);
                      return sum + (val ?? item.defaultWeight);
                    }, 0);

                    const isOptimal = total === 100;

                    return (
                      <span className={`font-bold text-lg ${isOptimal ? 'text-green-500' : 'text-red-500'}`}>
                        {total}%
                      </span>
                    );
                  }}
                </Form.Item>
              </div>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => {
                  return criteriaList.some(
                    (item) => prevValues[`weight_${item.id}`] !== currentValues[`weight_${item.id}`]
                  );
                }}
              >
                {({ getFieldValue }) => {
                  const total = criteriaList.reduce((sum, item) => {
                    const val = getFieldValue(`weight_${item.id}`);
                    return sum + (val ?? item.defaultWeight);
                  }, 0);

                  if (total === 100) return null;

                  return (
                    <p className="text-xs text-red-500 mt-1 text-right">
                      Total weight should be exactly 100% for optimal AI scoring.
                    </p>
                  );
                }}
              </Form.Item>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoringWeights;
