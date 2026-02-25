import React from "react";
import Button from "@/components/Button";

const PublishCard = ({ onCancel, isLoading, isDraftLoading, setAction }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Publish Job
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Review your job post details carefully before publishing. It will be
        visible to thousands of candidates immediately.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          mode="primary"
          size="lg"
          htmlType="submit"
          loading={isLoading}
          onClick={() => setAction("publish")}
        >
          Publish Now
        </Button>
        <Button
          mode="secondary"
          size="lg"
          htmlType="submit"
          loading={isDraftLoading}
          onClick={() => setAction("draft")}
          className="w-full justify-center"
          style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }} // Light gray background for secondary action
        >
          Save as Draft
        </Button>
      </div>
    </div>
  );
};

export default PublishCard;
