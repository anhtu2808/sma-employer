import React, { useState } from "react";
import { Modal, Input, message, Spin } from "antd";
import { useParseJobDescriptionMutation } from "@/apis/jobApi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '../../../../utils/icons';

const MIN_TEXT_LENGTH = 50;
const MAX_TEXT_LENGTH = 4000;

const ImportJDModal = ({ open, onCancel, onImported, masterData }) => {
  const [rawText, setRawText] = useState("");
  const [parseJD, { isLoading }] = useParseJobDescriptionMutation();

  const canParse = rawText.trim().length >= MIN_TEXT_LENGTH;

  const handleParse = async () => {
    if (!canParse) return;

    try {
      const result = await parseJD({
        rawText: rawText.trim(),
        masterData,
      }).unwrap();

      message.success(
        "JD imported successfully! Please review and complete missing fields."
      );
      onImported(result);
      setRawText("");
    } catch (error) {
      if (error?.status === 403) {
        message.error("JD Import quota exceeded. Upgrade your plan.");
      } else if (error?.status === 504) {
        message.error("Request timed out. Please try again.");
      } else {
        message.error("Failed to parse job description. Please try again.");
      }
      // Modal stays open on error for retry
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setRawText("");
      onCancel();
    }
  };

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary text-xl" />
          Import JD with AI
        </span>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnClose
      width={600}
      maskClosable={!isLoading}
      closable={!isLoading}
    >
      <div className="py-4 space-y-4">
        <p className="text-sm text-gray-500">
          Paste your job description text below. AI will extract structured data
          and auto-fill the form for you.
        </p>

        <Input.TextArea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your job description here..."
          rows={12}
          maxLength={MAX_TEXT_LENGTH}
          showCount
          disabled={isLoading}
          className="!resize-none"
        />

        {rawText.length > 0 && rawText.trim().length < MIN_TEXT_LENGTH && (
          <p className="text-xs text-amber-600">
            Please enter at least {MIN_TEXT_LENGTH} characters to parse (
            {rawText.trim().length}/{MIN_TEXT_LENGTH}).
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-5 h-10 rounded-lg border border-gray-200 text-gray-600 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleParse}
            disabled={!canParse || isLoading}
            className="px-5 h-10 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spin size="small" className="[&_.ant-spin-dot-item]:bg-white" />
                <span>Analyzing job description...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-base" />
                <span>Parse with AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportJDModal;
