import { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useToast } from "../../components/context/toastprovider";
import Loader from "../../components/loader";
import { FaBell, FaGift } from "react-icons/fa";
interface Notification {
  orderId: string;
  messageId: string;
  title: string;
  message: string;
  date: string;
}
interface Coupon {
  _id: string;
  code: string;
  amount: number;
  expiryDate: string;
  minPurchaseAmount: number;
  active: boolean;
  __v: number;
}
interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

const NotificationsPage = () => {
  const [adminNotifications, setAdminNotifications] = useState<
    AdminNotification[]
  >([]);

  const { showToast } = useToast();
  const id = useSelector((state: RootState) => state.user.user?._id);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"updates" | "coupons">("updates");
  const [updateTab, setUpdateTab] = useState<
    "all" | "orders" | "announcements"
  >("all");

  useEffect(() => {
    const fetchAdminNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/notification/all`,
        );

        if (data.success) {
          setAdminNotifications(data.notifications || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdminNotifications();
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/order/notifications/${id}`,
        );
        if (data.success) {
          const validNotifications = data.notifications.filter(
            (n: Notification) => n.message && n.messageId,
          );
          setNotifications(validNotifications);
        } else {
          showToast(data.message || "Failed to load notifications", "error");
        }
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          "Something went wrong while fetching notifications";
        showToast(msg, "neutral");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNotifications();
    else setLoading(false);
  }, [id]);

  // Fetch Coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/all`,
        );
        setCoupons(data.coupons || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoupons();
  }, []);

  // Delete Notification
  const handleDelete = async (orderId: string, messageId: string) => {
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_SERVER
        }/api/v1/order/notification/${orderId}/${messageId}`,
      );

      if (data.success) {
        setNotifications((prev) =>
          prev.filter((n) => n.messageId !== messageId),
        );
        showToast("Notification deleted successfully", "success");
      } else {
        showToast("Failed to delete notification", "error");
      }
    } catch (err) {
      showToast("Error deleting notification", "error");
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );

  const showEmptyNotifications =
    !id ||
    notifications.length === 0 ||
    notifications.every((n) => !n.orderId || !n.messageId);
  const showEmptyCoupons = coupons.length === 0;

  const allUpdates = [
    ...notifications.map((notif) => ({
      id: notif.messageId,
      title: "Order Update",
      message: notif.message,
      date: notif.date,
      type: "order",
      orderId: notif.orderId,
      messageId: notif.messageId,
    })),

    ...adminNotifications.map((notif) => ({
      id: notif._id,
      title: notif.title,
      message: notif.message,
      date: notif.createdAt,
      type: "announcement",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <div className="min-h-screen pt-28 bg-gray-50 p-5">
        {/* Welcome Card */}
        <div className="flex items-center justify-center ">
          <div className="relative overflow-hidden bg-white rounded-[32px] w-full shadow-2xl">
            {/* Gradient Top */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white">
              <p className="text-orange-50 text-sm">
                Stay tuned for exciting offers, order updates and special
                announcements.
              </p>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-30" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30" />
          </div>
        </div>
        <h2 className="text-2xl pt-10 font-semibold mb-6 text-gray-800">
          Your Updates
        </h2>

        <div className="flex gap-3 mb-8 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("updates")}
            className={`px-5 text-sm py-2 rounded-full transition-all duration-300 ${
              activeTab === "updates"
                ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white"
                : "text-gray-800 "
            }`}
          >
            Updates
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-5  text-sm py-2 rounded-full transition-all duration-300 ${
              activeTab === "coupons"
                ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white"
                : "text-gray-800 "
            }`}
          >
            Coupons
          </button>
        </div>

        {activeTab === "updates" && (
          <div className="flex gap-3 mb-8 overflow-x-auto">
            <button
              onClick={() => setUpdateTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                updateTab === "all"
                  ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setUpdateTab("orders")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                updateTab === "orders"
                  ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              Orders
            </button>

            <button
              onClick={() => setUpdateTab("announcements")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                updateTab === "announcements"
                  ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              Announcements
            </button>
          </div>
        )}
        {activeTab === "updates" && (
          <div className="space-y-8">
            {updateTab === "all" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  All Updates
                </h3>

                {allUpdates.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                    <FaBell className="mx-auto text-5xl text-gray-300 mb-4" />

                    <h2 className="text-xl font-semibold text-gray-800">
                      No Updates
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Your notifications will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allUpdates.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FaBell className="text-orange-500" />

                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.title}
                              </h3>

                              <p className="text-xs text-gray-400 capitalize">
                                {item.type}
                              </p>
                            </div>
                          </div>

                          {item.type === "order" && (
                            <button
                              onClick={() => setIsPopupOpen(true)}
                              className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        <p className="text-gray-600">{item.message}</p>

                        <p className="text-xs text-gray-400 mt-4">
                          {new Date(item.date).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Order Notifications */}
            {updateTab === "orders" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Updates
                </h3>

                {showEmptyNotifications ? (
                  <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                    <FaBell className="mx-auto text-5xl text-gray-300 mb-4" />

                    <h2 className="text-xl font-semibold text-gray-800">
                      No Order Updates
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Your order notifications will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.messageId}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <FaBell className="text-orange-500 text-lg" />

                          <button
                            onClick={() => setIsPopupOpen(true)}
                            className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="text-gray-700 text-sm leading-6">
                          {notif.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-5">
                          {new Date(notif.date).toLocaleString("en-IN")}
                        </p>

                        {isPopupOpen && (
                          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-3xl p-8 w-[340px] shadow-2xl">
                              <h3 className="text-xl font-bold text-center mb-4">
                                Delete Notification
                              </h3>

                              <p className="text-gray-500 text-center mb-6">
                                Are you sure you want to delete this
                                notification?
                              </p>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    setIsPopupOpen(false);
                                    handleDelete(
                                      notif.orderId,
                                      notif.messageId,
                                    );
                                  }}
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                                >
                                  Yes
                                </button>

                                <button
                                  onClick={() => setIsPopupOpen(false)}
                                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Admin Notifications */}
            {updateTab === "announcements" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Announcements
                </h3>

                {adminNotifications.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                    <FaBell className="mx-auto text-5xl text-gray-300 mb-4" />

                    <h2 className="text-xl font-semibold">No Announcements</h2>

                    <p className="text-gray-500 mt-2">
                      New announcements will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminNotifications.map((notif) => (
                      <div
                        key={notif._id}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <FaBell className="text-orange-500" />

                          <h3 className="font-semibold text-gray-800">
                            {notif.title}
                          </h3>
                        </div>

                        <p className="text-gray-600">{notif.message}</p>

                        <p className="text-xs text-gray-400 mt-4">
                          {new Date(notif.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "coupons" && (
          <>
            {showEmptyCoupons ? (
              <div className="flex flex-col items-center justify-center !p-0 my-24 rounded-lg">
                <div className="p-8 text-center w-full max-w-md">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <FaGift className="text-gray-400 text-5xl animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Coupons
                  </h2>
                  <p className="text-gray-500 mb-6">
                    You don't have any active coupons yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="text-sm text-gray-700">
                      🎉 You have a coupon <strong>{coupon.code}</strong> on
                      orders over ₹{coupon.minPurchaseAmount}. Hurry up!
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Expires on{" "}
                      {new Date(coupon.expiryDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default NotificationsPage;
