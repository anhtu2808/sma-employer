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
          criteriaList.map((criteriaItem) => (
            <div key={criteriaItem.id}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {criteriaItem.name}
                </span>
                <span className="text-orange-500 font-medium">{`(${criteriaItem.defaultWeight}%)`}</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default ScoringWeights;
