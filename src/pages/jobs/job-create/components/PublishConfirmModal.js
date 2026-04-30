import React from "react";
import { Modal, Switch } from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sparkles } from 'lucide-react';
import { faBolt, faCalendarDay, faChartSimple, faTriangleExclamation } from '../../../../utils/icons';

const PublishConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  loading,
  values,
  featureUsage = [],
  isEditMode,
  onValuesChange,
}) => {
  const jobPostQuota = featureUsage.find(
    (f) => f.featureKey === "JOB_POSTING"
  );
  const isAtLimit =
    jobPostQuota && jobPostQuota.maxQuota > 0 &&
    jobPostQuota.used >= jobPostQuota.maxQuota;
  const isNearLimit =
    jobPostQuota && jobPostQuota.maxQuota > 0 &&
    !isAtLimit &&
    jobPostQuota.used / jobPostQuota.maxQuota >= 0.8;

  const formattedDeadline = values?.expDate
    ? dayjs(values.expDate).format("MMM DD, YYYY HH:mm")
    : null;

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <FontAwesomeIcon icon={faBolt} className="text-primary text-xl" />
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
            <FontAwesomeIcon icon={faCalendarDay} className="text-sm" />
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
            <Sparkles size={14} className="text-yellow-500" />
            Premium Features
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Highlight Job</span>
              <Switch
                size="small"
                checked={values?.highlightJob === true}
                style={values?.highlightJob ? { backgroundColor: "#FF6B35" } : undefined}
                onChange={(checked) => onValuesChange?.({ highlightJob: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">AI Scoring</span>
              <Switch
                size="small"
                checked={values?.enableAiScoring === true}
                style={values?.enableAiScoring ? { backgroundColor: "#FF6B35" } : undefined}
                onChange={(checked) => onValuesChange?.({ enableAiScoring: checked })}
              />
            </div>
          </div>
        </div>

        {/* Quota Usage */}
        {jobPostQuota && (
          <div>
            <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <FontAwesomeIcon icon={faChartSimple} className="text-sm" />
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
            {isAtLimit && (
              <div className="mt-2 flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                <FontAwesomeIcon icon={faTriangleExclamation} className="mt-px text-sm text-red-600" />
                <span>
                  You have reached your job post quota limit. Upgrade your plan to publish more jobs.
                </span>
              </div>
            )}
            {isNearLimit && (
              <div className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100">
                <FontAwesomeIcon icon={faTriangleExclamation} className="mt-px text-sm text-amber-600" />
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
