import React from "react";
import { Modal } from "antd";

const PostMethodModal = ({ open, onCancel, onSelectManual, onSelectAI }) => {
  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className="material-icons-round text-primary text-xl">post_add</span>
          Choose Post Method
        </span>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
      width={520}
    >
      <div className="py-4 space-y-3">
        <p className="text-sm text-gray-500 mb-4">
          How would you like to create your job posting?
        </p>

        {/* Option 1: Import with AI */}
        <button
          type="button"
          onClick={onSelectAI}
          className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <span className="material-icons-round text-2xl text-primary mt-0.5">
              auto_awesome
            </span>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Import with AI
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                Paste a JD and let AI fill the form automatically
              </div>
            </div>
          </div>
        </button>

        {/* Option 2: Manual Compose */}
        <button
          type="button"
          onClick={onSelectManual}
          className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <span className="material-icons-round text-2xl text-gray-600 group-hover:text-primary mt-0.5">
              edit_note
            </span>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Manual Compose
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                Fill in all fields manually as usual
              </div>
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
};

export default PostMethodModal;
