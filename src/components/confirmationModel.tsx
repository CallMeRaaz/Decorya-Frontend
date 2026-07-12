import React from "react";

interface ConfirmationModalProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = "Confirm Action",
  message,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl p-8 w-64 md:w-96 shadow-2xl">
        <h3 className="text-xl text-gray-950 font-bold mb-4 text-center">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
