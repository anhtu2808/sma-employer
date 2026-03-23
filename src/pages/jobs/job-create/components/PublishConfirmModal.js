import React from "react";
import { Modal, Tag } from "antd";
import dayjs from "dayjs";

const PublishConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  loading,
  values,
  featureUsage = [],
  isEditMode,
}) => {
  const jobPostQuota = featureUsage.find(
    (f) => f.featureKey === "JOB_POSTING"
  );
  const isNearLimit =
    jobPostQuota && jobPostQuota.maxQuota > 0 &&
    jobPostQuota.used / jobPostQuota.maxQuota >= 0.8;

  const formattedDeadline = values?.expDate
    ? dayjs(values.expDate).format("MMM DD, YYYY HH:mm")
    : null;

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className="material-icons-round text-primary text-xl">bolt</span>
          Confirm Publish
        </span>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Confirm Publish"
      cancelText="Cancel"
      confirmLoading={loading}
      okButtonProps={{
        style: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
      }}
      centered
      width={480}
    >
      <div className="space-y-4 py-2">
        {/* Job Title */}
        <div>
          <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            Job Title
          </div>
          <div className="text-base font-semibold text-gray-900 dark:text-white">
            {values?.name || "Untitled Job"}
          </div>
        </div>

        {/* Application Deadline */}
        <div>
          <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
            <span className="material-icons-round text-sm">calendar_today</span>
            Application Deadline
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {formattedDeadline || (
              <span className="text-gray-400 italic">No deadline set</span>
            )}
          </div>
        </div>

        {/* Premium Features */}
        <div>
          <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
            <span className="material-icons-round text-sm text-yellow-500">auto_awesome</span>
            Premium Features
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Highlight Job</span>
              <Tag color={values?.highlightJob ? "blue" : "default"} className="m-0">
                {values?.highlightJob ? "ON" : "OFF"}
              </Tag>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">AI Scoring</span>
              <Tag color={values?.enableAiScoring ? "blue" : "default"} className="m-0">
                {values?.enableAiScoring ? "ON" : "OFF"}
              </Tag>
            </div>
          </div>
        </div>

        {/* Quota Usage */}
        {jobPostQuota && (
          <div>
            <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <span className="material-icons-round text-sm">bar_chart</span>
              Quota Usage
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Job Posts:{" "}
              <span className="font-medium">
                {jobPostQuota.used}/{jobPostQuota.maxQuota}
              </span>
              {!isEditMode && (
                <span className="text-gray-400">
                  {" "}&rarr; {jobPostQuota.used + 1}/{jobPostQuota.maxQuota}
                </span>
              )}
            </div>
            {isNearLimit && (
              <div className="mt-2 flex items-start gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-md px-3 py-2 text-xs">
                <span className="material-icons-round text-sm mt-px">warning</span>
                <span>
                  You are approaching your job post quota limit. Consider upgrading your plan for more posts.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PublishConfirmModal;
