import React from "react";
import { Modal as AntdModal } from "antd";

const Modal = ({
  open,
  title,
  onCancel,
  loading = false,
  loadingText = "Saving...",
  submitText = "Save",
  submitDisabled = false,
  cancelText = "Cancel",
  width = 860,
  formId,
  children,
  onSubmit, // Added optional onSubmit for modals without forms
  danger = false, // Added to support destructive actions like reject
}) => {
  return (
    <AntdModal open={open} onCancel={onCancel} footer={null} centered destroyOnClose width={width}>
      <div className="-mx-6 -mt-2 border-b border-gray-100 px-6 pb-4">
        <h3 className="text-[20px] leading-7 font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>

      <div className="pt-6">{children}</div>

      <div className="-mx-6 mt-8 border-t border-gray-100 px-6 pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 h-10 rounded-lg border border-gray-200 text-gray-600 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {cancelText}
        </button>

        <button
          type={formId ? "submit" : "button"}
          form={formId}
          onClick={onSubmit}
          disabled={loading || submitDisabled}
          className={`px-5 h-10 rounded-lg text-white hover:opacity-90 disabled:opacity-50 transition-colors ${
            danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary'
          }`}
        >
          {loading ? loadingText : submitText}
        </button>
      </div>
    </AntdModal>
  );
};

export default Modal;
