import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "neutral";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "neutral",
  duration = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show toast
    setVisible(true);

    // Hide after duration
    const timer = setTimeout(() => setVisible(false), duration);

    // Call onClose after fade-out animation
    const removeTimer = setTimeout(() => onClose(), duration + 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  // Click handler to close immediately
  const handleClick = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); // allow fade-out animation
  };

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    neutral: "bg-gray-600 text-white",
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg cursor-pointer
                  ${typeClasses[type]} w-11/12 max-w-md md:max-w-lg text-center
                  transition-all duration-300 ease-in-out select-none
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      {message}
    </div>
  );
};

export default Toast;
