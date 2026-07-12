import {
  FaBarcode,
  FaCalendarAlt,
  FaCommentDots,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Model from "../../../components/admin/Model";

import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { RootState } from "../../../redux/store";
import { Order } from "../../../types/types";
import Loader from "../../../components/loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../components/context/toastprovider";

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    name: "",
    email: "",
    mobNo: "",
    altMob: "",
  },
  modeOfPayment: "",
  status: "",
  message: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
  amount: undefined,
  customerName: undefined,
  updatedAt: "",
  total: 0,
  trackingId: "",
  deliveryDate: "",
};

const TransactionManagement = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pinCode } = {},
    orderItems = [],
    user: { name } = {},
    status,
    subtotal,
    total,
    discount,
    shippingCharges,
    modeOfPayment,
    trackingId: backendTrackingId,
    deliveryDate: backendDeliveryDate,
  } = data?.order || defaultData;

  const { showToast } = useToast();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showTrackingBox, setShowTrackingBox] = useState(false);
  const [message, setMessage] = useState("");
  const [trackingId, setTrackingId] = useState(backendTrackingId || "");
  const [deliveryDate, setDeliveryDate] = useState(
    backendDeliveryDate ? backendDeliveryDate.split("T")[0] : ""
  );

  useEffect(() => {
    if (data?.order) {
      setTrackingId(data.order.trackingId || "");
      setMessage(data.order.message || "");
      setDeliveryDate(
        data.order.deliveryDate ? data.order.deliveryDate.split("T")[0] : ""
      );
    }
  }, [data]);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // ✅ Update Tracking
  const updateTrackingHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId && !deliveryDate) return;

    try {
      const orderId = data?.order._id;
      if (!orderId) return;

      const res = await axios.put(
        `${
          import.meta.env.VITE_SERVER
        }/api/v1/order/updatetracking/${orderId}?id=${user?._id}`,
        { trackingId, deliveryDate }
      );

      if (res.data?.success) {
        showToast("Tracking info updated successfully!", "success");
        navigate(`/admin/order/${orderId}`);
      }
    } catch (error) {
      showToast("Error updating tracking info", "error");
      console.error("Error updating order:", error);
    }
  };

  // ✅ Update Order Status
  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });

    if (res.data?.success) {
      showToast("Order updated successfully!", "success");
      navigate(`/admin/transaction`);
    } else {
      showToast("Failed to update order", "error");
    }
  };

  // ✅ Send Message
  const sendMessageHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const orderId = data?.order._id;
      if (!orderId) return;

      const res = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/order/message/${orderId}?id=${
          user?._id
        }`,
        { message }
      );

      if (res.data?.success) {
        showToast("Message sent successfully!", "success");
        navigate(`/admin/order/${orderId}`);
        setMessage(res.data.order.message);
        setShowMessageBox(false);
      }
    } catch (error) {
      showToast("Error sending message", "error");
      console.error("Error sending message:", error);
    }
  };

  // ✅ Delete Order
  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });

    if (res.data?.success) {
      showToast("Order deleted successfully!", "success");
      navigate(`/admin/transaction`);
    } else {
      showToast("Failed to delete order", "error");
    }
  };

  // ✅ Cancel Order
  const cancelHandler = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/order/cancel/${data?.order._id}`
      );

      if (res.data?.success) {
        showToast("Order cancelled successfully!", "success");
        navigate("/admin/transaction");
      } else {
        showToast(res.data?.message || "Failed to cancel order", "error");
      }
    } catch (err) {
      showToast("Something went wrong while cancelling order", "error");
      console.error(err);
    }
  };

  if (isError) {
    showToast("Failed to load order details", "error");
    navigate(`/404`);
  }

  return (
    <div className="   pt-28">
      <Model />
      <main className="flex-1 p-6">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">
                  Order Items
                </h2>
                <button
                  className="8 p-3 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                  onClick={deleteHandler}
                  title="Delete Order"
                >
                  <FaTrash className="text-red-700 w-6 h-5" />
                </button>
              </div>

              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="block hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex items-center py-3 border-b border-gray-200">
                      <img
                        src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover mr-4"
                      />
                      <div className="flex-1 ">
                        <p className="text-sm text-gray-800">
                          {item.name} - {item._id}
                        </p>
                        <div className="flex justify-between mt-1 text-sm text-gray-600">
                          <span>Price: ₹{item.mainPrice}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-lg">No items in this order.</p>
              )}
            </div>

            {showMessageBox && (
              <form
                onSubmit={sendMessageHandler}
                className="my-6 flex flex-col md:flex-row gap-3 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md"
              >
                {/* Custom Message Input */}
                <textarea
                  placeholder="Enter your custom message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 bg-transparent focus:ring-yellow-400 resize-none"
                />

                {/* OR Select a predefined message */}
                <select
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  value=""
                >
                  <option value="">Select a message...</option>
                  <option value="Your order has been confirmed and will be shipped soon.">
                    Order Confirmed
                  </option>
                  <option value="Your order has been shipped and is on the way.">
                    Order Shipped
                  </option>
                  <option value="Your order is out for delivery. Please keep your phone handy.">
                    Out for Delivery
                  </option>
                  <option value="Your order has been successfully delivered. Thank you for shopping with us!">
                    Order Delivered
                  </option>
                  <option value="Your order has been cancelled. Please contact support for more info.">
                    Order Cancelled
                  </option>
                  <option value="Thanks for your purchase! We appreciate your trust in us.">
                    Thank You Message
                  </option>
                </select>

                {/* Send Button */}
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow transition-all"
                >
                  Send
                </button>
              </form>
            )}
            {showTrackingBox && (
              <form
                onSubmit={updateTrackingHandler}
                className="flex flex-col md:flex-row gap-4 my-4 p-4 bg-gray-50 border rounded shadow-md"
              >
                {/* Tracking ID Input */}
                <div className="flex items-center p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow-md flex-1">
                  <FaBarcode className="w-5 h-5 text-blue-500 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter Tracking ID"
                    className="flex-1 p-2 border rounded focus:outline-none bg-transparent focus:ring-2 focus:ring-blue-400"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>

                {/* Delivery Date Input */}
                <div className="flex items-center p-4 bg-green-50 border-l-4 border-green-500 rounded shadow-md flex-1">
                  <FaCalendarAlt className="w-5 h-5 text-green-500 mr-3" />
                  <input
                    type="date"
                    className="flex-1 p-2 border rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // today's date
                    max={
                      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    } // +15 days
                  />
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow transition-all self-start md:self-center"
                >
                  Update Order
                </button>
              </form>
            )}

            {/* Shipping & Order Info */}
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                  Order Info
                </h2>
                <div>
                  <button
                    onClick={() => setShowMessageBox(!showMessageBox)}
                    className="absolute top-4 right-2 p-3 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors"
                    title="Send Message"
                  >
                    <FaCommentDots className="text-yellow-600 w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowTrackingBox(!showTrackingBox)}
                    className="absolute top-4 right-16 p-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                    title="Send Tracking and Date"
                  >
                    <FaCalendarAlt className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">User Info</h3>
                <p>
                  Name: <span className="font-medium">{name}</span>
                </p>
                <p>
                  Address:{" "}
                  <span className="font-medium">
                    {`${address}, ${city}, ${state}, ${country} - ${pinCode}`}
                  </span>
                </p>
              </div>

              {/* Amount Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Amount Info
                </h3>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <p>
                    Subtotal: <span className="font-medium">₹{subtotal}</span>
                  </p>
                  <p>
                    Shipping:{" "}
                    <span className="font-medium">₹{shippingCharges}</span>
                  </p>
                  <p>
                    Discount: <span className="font-medium">₹{discount}</span>
                  </p>
                  <p>
                    Total:{" "}
                    <span className="font-medium text-green-600">₹{total}</span>
                  </p>
                </div>
              </div>

              {/* Status Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 mt-8">
                  Status Info & Mode Of Payment
                </h3>
                <p className="mt-4">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                      status === "Confirmed"
                        ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                        : status === "Shipped"
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                        : status === "Out for Delivery"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                        : status === "Delivered"
                        ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                        : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                    }`}
                  >
                    {status}
                  </span>
                </p>
                <p className="my-8">
                  <span
                    className={`px-5 py-2 rounded-3xl font-bold text-white ${
                      modeOfPayment === "UPI"
                        ? "bg-gradient-to-r from-pink-400 to-pink-600"
                        : modeOfPayment === "COD"
                        ? "bg-gradient-to-r from-orange-400 to-orange-600"
                        : modeOfPayment === "CARD"
                        ? "bg-gradient-to-r from-teal-400 to-teal-600"
                        : "bg-gradient-to-r from-gray-500 to-gray-700"
                    }`}
                  >
                    {modeOfPayment === "UPI"
                      ? "Unified Payments Interface"
                      : modeOfPayment === "COD"
                      ? "Cash on Delivery"
                      : modeOfPayment === "CARD"
                      ? "Credit/Debit Card"
                      : modeOfPayment}
                  </span>
                </p>
              </div>

              <div className="flex flex-col justify-between p-5 mt-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm flex-1 min-h-[100px]">
                <div className="flex items-center space-x-3 mb-2">
                  <FaCommentDots className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700 text-sm font-medium">
                    Order Message
                  </span>
                </div>

                <span className="text-yellow-700 text-sm font-semibold break-words">
                  {message}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 my-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded shadow-sm flex-1">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm font-medium">
                      Expected Delivery Date
                    </span>
                  </div>
                  <span className="text-green-700 text-sm font-semibold">
                    {deliveryDate
                      ? new Date(deliveryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow-sm flex-1">
                  <div className="flex items-center space-x-3">
                    <FaBarcode className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 text-sm font-medium">
                      Tracking ID
                    </span>
                  </div>
                  <span className="text-blue-700 text-sm font-semibold">
                    {trackingId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4">
                {status !== "Cancelled" &&
                  (trackingId && deliveryDate ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow transition-all"
                      onClick={updateHandler}
                    >
                      Process Status
                    </button>
                  ) : (
                    <p className="text-gray-500 text-sm mt-2">
                      Please enter{" "}
                      <span className="font-medium">Tracking ID</span> and{" "}
                      <span className="font-medium">Delivery Date</span> to
                      process status.
                    </p>
                  ))}

                {status === "Confirmed" && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition-all"
                    onClick={cancelHandler}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TransactionManagement;
