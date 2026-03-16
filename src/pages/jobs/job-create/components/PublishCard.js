import React from "react";
import Button from "@/components/Button";
import { Form, Switch, Tooltip } from "antd";
import { Info } from "lucide-react";

const PublishCard = ({ onCancel, isLoading, isDraftLoading, setAction, isEditMode }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Update Job" : "Publish Job"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode
              ? "Review your changes carefully before saving. Updated details will be reflected immediately."
              : "Review your job post details carefully before publishing."}
          </p>
        </div>
      </div>

      <div className="pt-2 pb-2 border-t border-b border-gray-100 dark:border-gray-700/50">
        <Form.Item
          name="highlightJob"
          valuePropName="checked"
          className="mb-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                Highlight Job
              </label>
              <Tooltip title="Highlighting a job increases its visibility to candidates by displaying it at the top of search results with a special badge.">
                <Info size={14} className="text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <Switch />
          </div>
        </Form.Item>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          mode="primary"
          size="lg"
          htmlType="submit"
          loading={isLoading}
          onClick={() => setAction("publish")}
        >
          {isEditMode ? "Save & Publish" : "Publish Now"}
        </Button>
        <Button
          mode="secondary"
          size="lg"
          htmlType="submit"
          loading={isDraftLoading}
          onClick={() => setAction("draft")}
          className="w-full justify-center"
          style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }}
        >
          {isEditMode ? "Save as Draft" : "Save as Draft"}
        </Button>
      </div>
    </div>
  );
};

export default PublishCard;
