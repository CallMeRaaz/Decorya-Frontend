import {
  FaClipboardCheck,
  FaBoxes,
  FaTruck,
  FaHome,
  FaTimesCircle,
  FaCalendarAlt,
  FaBarcode,
  FaCommentDots,
} from "react-icons/fa";
import { OrderItem, ShippingInfo, User } from "../../types/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/context/toastprovider";

interface Order {
  _id: string;
  user: User;
  modeOfPayment: string;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: OrderItem[];
  createdAt: string;
  trackingId: string;
  message: string;
  deliveryDate: Date;
  updatedAt: string;
  shippingInfo: ShippingInfo;
}

const OrderTracker = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/order/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        if (data.success) setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const cancelHandler = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/order/cancel/${id}`
      );

      if (res.data?.success) {
        showToast("Order cancelled successfully!", "success");
        navigate("/orders");
      } else {
        showToast(res.data?.message || "Failed to cancel order", "error");
      }
    } catch (err) {
      showToast("Something went wrong while cancelling order", "error");
      console.error(err);
    }
  };

  const defaultSteps = [
    {
      label: "Order Confirmed",
      icon: <FaClipboardCheck />,
      color: "text-green-500",
    },
    { label: "Order Shipped", icon: <FaBoxes />, color: "text-yellow-500" },
    { label: "Out for Delivery", icon: <FaTruck />, color: "text-blue-500" },
    { label: "Order Delivered", icon: <FaHome />, color: "text-purple-500" },
  ];

  // If order is cancelled, show Cancelled step
  const steps =
    order?.status?.toLowerCase() === "cancelled"
      ? [
          {
            label: "Order Confirmed",
            icon: <FaClipboardCheck />,
            color: "text-green-500",
          },
          {
            label: "Order Cancelled",
            icon: <FaTimesCircle />,
            color: "text-red-500",
            isCancelled: true,
          },
        ]
      : defaultSteps;
  const statusToStepIndex = (status: string) => {
    if (!status) return 0; // handle undefined
    if (status.toLowerCase() === "cancelled") return 1;
    switch (status.toLowerCase()) {
      case "confirmed":
        return 0;
      case "shipped":
        return 1;
      case "out for delivery":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = order ? statusToStepIndex(order.status) : 0;

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-white p-6 rounded-xl shadow-lg pt-10 mb-6 w-full max-w-4xl">
        <div className="sm:my-4 sm:pb-4">
          <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
          <p className="text-gray-500 mb-6">
            Check the status of recent and old orders & discover more products.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
          {/* Horizontal Line for desktop */}
          <div className="hidden md:block absolute bottom-28 left-0 mx-24 right-4 h-1 bg-gray-300 z-0 rounded">
            <div
              className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
            {/* Circles */}
            {steps.map((_, index) => (
              <div
                key={index}
                className={`absolute -top-1.5 w-4 h-4 rounded-full z-10 transform -translate-x-1/2 ${
                  index < currentStep
                    ? "bg-green-500 border-green-600"
                    : index === currentStep
                    ? "bg-blue-500 border-blue-600"
                    : "bg-gray-200 border-gray-300"
                } border-2`}
                style={{
                  left: `${(index / (steps.length - 1)) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Vertical Line for mobile */}
          <div className="md:hidden absolute left-1 my-5 top-0 bottom-7 w-1 bg-gray-300 z-0 rounded">
            <div
              className="w-1 bg-gradient-to-b from-green-500 to-blue-500 rounded"
              style={{
                height: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
            {/* Circles */}
            {steps.map((_, index) => (
              <div
                key={index}
                className={`absolute -left-1.5 w-4 h-4 rounded-full z-10 transform -translate-y-1/2 ${
                  index < currentStep
                    ? "bg-green-500 border-green-600"
                    : index === currentStep
                    ? "bg-blue-500 border-blue-600"
                    : "bg-gray-200 border-gray-300"
                }`}
                style={{
                  top: `${(index / (steps.length - 1)) * 100}%`,
                }}
              />
            ))}
          </div>

          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isCancelled = step.isCancelled;

            return (
              <div
                key={index}
                className="flex md:top-5 md:pb-8 relative flex-row mr-10 md:flex-col pl-6 items-center md:items-center mb-6 md:mb-0 md:flex-1"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                    isCancelled
                      ? "bg-red-500 border-red-500 text-white"
                      : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-200 border-gray-300 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>

                <div
                  className={`ml-3 md:ml-0 mt-0 md:mt-3 text-sm font-semibold ${
                    isCancelled ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        {order.message && (
          <div className="flex flex-col justify-between p-5 mt-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm flex-1 min-h-[100px]">
            <div className="flex items-center space-x-3 mb-2">
              <FaCommentDots className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 text-sm font-medium">
                Order Message
              </span>
            </div>

            <span className="text-yellow-700 text-sm font-semibold break-words">
              {order.message}
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 my-4">
          {/* Expected Delivery Date */}
          <div className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded shadow-sm flex-1">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="w-4 h-4 text-green-500" />
              <span className="text-gray-700 text-sm font-medium">
                {order.status === "Delivered"
                  ? "Delivered On"
                  : "Expected Delivery Date"}
              </span>
            </div>
            <span
              className={`${
                order.status === "Delivered"
                  ? "text-gray-700"
                  : "text-green-700"
              } text-sm font-semibold`}
            >
              {order.status === "Delivered" && order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : order.status !== "Delivered" && order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>

          {order.status !== "Delivered" && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow-sm flex-1">
              <div className="flex items-center space-x-3">
                <FaBarcode className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700 text-sm font-medium">
                  Tracking ID
                </span>
              </div>
              <span className="text-blue-700 text-sm font-semibold">
                {order.trackingId}
              </span>
            </div>
          )}

          {order.status === "Confirmed" && (
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 font-semibold px-4 py-2 rounded-md shadow transition-all"
            >
              Cancel Order
            </button>
          )}

          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-white rounded-2xl p-8 w-64 md:w-96 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Cancel Order
                </h3>

                {/* Info */}
                <div className="flex items-start gap-2 mb-6">
                  <p className="text-gray-600 text-sm">
                    Are you sure you want to cancel this order?
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopupOpen(false);
                      cancelHandler();
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
