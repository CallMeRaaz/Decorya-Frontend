import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { clearUser } from "../../redux/reducer/userReducer";
import Breadcrumbs from "../../components/breadcrumbs";
import Cookie from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, Key } from "react";
import axios from "axios";
import { setUser } from "../../redux/reducer/userReducer";
import { FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { FaUserEdit, FaTools } from "react-icons/fa";
import profile_bg from "../../assets/frontend_assets/profile_bg.png";
import A1 from "../../assets/frontend_assets/A1.png";
import A2 from "../../assets/frontend_assets/A2.png";
import A3 from "../../assets/frontend_assets/A3.png";
import A4 from "../../assets/frontend_assets/A4.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/context/toastprovider";
import Loader from "../../components/loader";

interface Order {
  status: string;
  orderItems: any;
  _id: string;
  createdAt: string;
  total: number;
}

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  mobNo: string;
  altMob: string;
}
const Profile = () => {
  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
  ];
  const id = useSelector((state: RootState) => state.user.user?._id);
  const user = useSelector((state: RootState) => state.user.user);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [lastLogin, setLastLogin] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isRole, setIsRole] = useState<boolean>(false);
  const toastShown = useRef(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState<string>("");

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setTimeRemaining] = useState<number>(300);

  const savedShippingInfos: ShippingInfo[] = JSON.parse(
    localStorage.getItem("shippingInfos") || "[]"
  );

  const inputs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const avatars = [
    { name: "A1", src: A1 },
    { name: "A2", src: A2 },
    { name: "A3", src: A3 },
    { name: "A4", src: A4 },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/user/me/${id}`
        );
        const user = response.data.user;

        setCreatedAt(user.createdAt || "");
        setLastLogin(user.lastLogin || "");
        setIsVerified(user.isVerified || false);
        setIsRole(user?.role === "admin");
        setName(user.name || "");
        setEmail(user.email || "");

        // Map avatar string from backend to image
        const avatarIndex = avatars.findIndex((a) => a.name === user.avatar);
        if (avatarIndex !== -1) {
          setSelected(avatarIndex);
        }

        // Show OTP modal if not verified
        if (!user.isVerified && !toastShown.current) {
          showToast("You need to verify your account.", "neutral");
          toastShown.current = true;
          setShowOtpModal(true);
        }
      } catch (error) {
        showToast("Failed to fetch user details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserDetails();
  }, [id]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordCriteria({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&#]/.test(value),
    });
  };
  // Logout Function
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      Cookie.remove("token");
      dispatch(clearUser());
      showToast("Logged out successfully.", "success");
      navigate("/"); // smoother navigation
    } catch (err) {
      showToast("Failed to logout. Try again.", "error");
    }
  };

  // Verify OTP Function
  const handleVerify = async () => {
    const otpValue = inputs.current.map((input) => input?.value).join("");

    if (otpValue.length !== 5) {
      showToast("Please enter a valid 5-digit OTP.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/verify-email`,
        { code: otpValue }
      );

      if (response.data.success) {
        showToast("OTP verified successfully!", "success");
        setIsVerified(true);
        setShowOtpModal(false);

        // Dispatch setUser to update localStorage and Redux state
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } else {
        showToast(response.data.message || "Invalid or expired OTP.", "error");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "OTP verification failed.",
          "error"
        );
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Resend OTP Function
  const handleResendOTP = async () => {
    if (!email) {
      showToast("No email found. Please retry.", "error");
      return;
    }

    try {
      setIsResending(true);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/resend-verification-token`,
        { email }
      );

      if (response.data.success) {
        showToast("OTP resent successfully!", "success");
        setTimeRemaining(300); // reset timer
      } else {
        showToast(response.data.message || "Failed to resend OTP.", "error");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "Failed to resend OTP.",
          "error"
        );
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.length === 1 && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      // Clear the current input value
      if (inputs.current[index]?.value) {
        inputs.current[index]!.value = "";
      }

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user has edited at least one field
    if (!name && !password && selected === null) {
      showToast("Please update at least one field!", "error");
      return;
    }

    // Validation (apply only to fields being updated)
    if (name && name.trim().length < 3) {
      return showToast("Name must be at least 3 characters!", "error");
    }

    if (password && !Object.values(passwordCriteria).every(Boolean)) {
      return showToast("Please enter a strong password!", "error");
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SERVER}/api/v1/user/me/${id}`;
      const payload: any = {};

      // Only include the fields that were updated
      if (name) payload.name = name.trim();
      if (password) payload.password = password;
      if (selected !== null) payload.avatar = avatars[selected].name;

      const { data } = await axios.put(apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success && data.user) {
        showToast("Profile updated successfully!", "success");
        dispatch(setUser(data.user));
        setShowEditModal(false);
        navigate("/profile");
      } else {
        showToast(data.message || "Failed to update profile.", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true); // Open the edit modal
  };

  const closeEditModal = () => {
    setShowEditModal(false); // Close the edit modal
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/v1/order/my?id=${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      const sortedOrders = data.orders.sort((a: Order, b: Order) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <Breadcrumbs breadcrumbs={breadcrumbData} />

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row justify-center gap-6">
        {/* LEFT SIDE - Profile Card */}
        <div className="w-full  sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[35%]">
          <div className="bg-white  rounded-lg text-gray-900">
            <div className="rounded-t-lg h-36 overflow-hidden">
              <img
                className="object-cover object-top w-full"
                src={profile_bg}
                alt="profile_bg"
              />
            </div>

            {/* Profile Info Section */}
            <div className="flex items-center px-6 -mt-12">
              {/* Profile Image (Left-aligned) */}
              <div className="w-28 h-28 border-4 border-white rounded-full overflow-hidden shadow-lg">
                {selected !== null && (
                  <img
                    src={avatars[selected].src}
                    alt={avatars[selected].name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Name and Details */}
              <div className="ml-4 mt-10">
                <h2 className="font-semibold text-lg text-gray-900">{name}</h2>
              </div>
            </div>

            <div className="w-full rounded-lg p-4 flex sm:flex-row sm:items-center justify-between gap-3">
              <span className=" text-sm text-gray-500">
                <span className="flex flex-col text-gray-900 font-semibold items-start  gap-1">
                  Email:
                  <span className="font-medium text-gray-700">{email}</span>
                </span>
                <span className="flex flex-col text-gray-900 font-semibold items-start  gap-1">
                  Joined:{" "}
                  <span className="font-medium text-gray-700">
                    {createdAt
                      ? new Date(createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </span>
                </span>

                <span className="flex flex-col text-gray-900 font-semibold items-start gap-1">
                  Last Login:{" "}
                  <span className="font-medium text-gray-700">
                    {lastLogin
                      ? new Date(lastLogin).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </span>
                </span>
              </span>

              <span className="flex flex-col">
                <button
                  onClick={openEditModal}
                  className="flex items-center font-semibold gap-2 h-8 px-2 my-1 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition text-xs justify-center"
                >
                  <FaUserEdit /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center font-semibold gap-2 h-8 px-2 my-1 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs justify-center"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </span>
            </div>

            <div className="flex justify-center pb-10 border-b">
              {!isVerified && (
                <button
                  onClick={() => {
                    setShowOtpModal(true);
                    showToast(
                      "Your OTP may have expired. Please click 'Resend OTP' to receive a new one.",
                      "neutral"
                    );
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition text-sm justify-center"
                >
                  <FaEnvelope /> Verify Email
                </button>
              )}
            </div>

            {isRole && (
              <div className="flex mb-6 flex-wrap justify-center py-6 px-4 border-b">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition text-sm justify-center"
                >
                  <FaTools /> Admin
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-3 py-4 text-gray-700">
              {/* Header Section */}
              <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Saved Addresses
                </h2>
                <Link to="/saved-address">
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    View All
                  </button>
                </Link>
              </div>
              <div className="w-full h-auto rounded-lg p-4 flex justify-between items-center transition">
                {savedShippingInfos.length > 0 && (
                  <div>
                    {savedShippingInfos.slice(0, 2).map((info, index) => (
                      <div
                        key={index}
                        className={`p-5 mb-2 rounded-lg shadow-lg cursor-pointer transform transition hover:scale-105 
                                flex justify-between items-start`}
                      >
                        <div className="flex flex-col">
                          <label className="text-gray-800 font-medium mb-1">
                            {info.name}
                          </label>
                          <span className="text-gray-600 text-sm">
                            {info.address}, {info.city}, {info.state},{" "}
                            {info.country}, {info.pinCode}
                          </span>
                          <span className="text-gray-600 text-sm mt-1">
                            Mobile: {info.mobNo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Recent Orders */}
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[35%]">
          <div className="bg-white rounded-lg p-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
              Recent Orders
              <Link to="/orders">
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  View All
                </button>
              </Link>
            </h3>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    to={`/order/${order._id}`}
                    key={order._id}
                    className="block  border-gray-200 rounded-xl bg-white shadow-md hover:shadow-xl transform transition hover:-translate-y-1"
                  >
                    <div className="p-5 flex flex-col h-full justify-between">
                      {/* Order Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-800 font-semibold text-sm mb-1">
                            Order ID:{" "}
                            <span className="text-indigo-600">
                              {order._id.slice(0, 8)}...
                            </span>
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            at{" "}
                            {new Date(order.createdAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex -space-x-2 mt-1">
                          {order.orderItems
                            .slice(0, 4)
                            .map(
                              (item: {
                                _id: Key | null | undefined;
                                photo: string;
                                name: string;
                              }) => (
                                <img
                                  key={item._id}
                                  src={`${import.meta.env.VITE_SERVER}/${
                                    item.photo
                                  }`}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                />
                              )
                            )}
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                            order.status === "Confirmed"
                              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                              : order.status === "Shipped"
                              ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                              : order.status === "Out for Delivery"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                              : order.status === "Delivered"
                              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                              : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-green-700 font-bold text-base">
                          ₹ {order.total}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto relative">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Edit Profile
            </h2>

            {/* Avatar Preview */}
            {selected !== null && (
              <div className="flex justify-center mb-4">
                <img
                  src={avatars[selected].src}
                  alt={avatars[selected].name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
              </div>
            )}
            {selected == null && (
              <div className="flex justify-center mb-4">
                <img
                  src={""}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
              </div>
            )}

            {/* Avatar Selection Button */}
            <p className="text-center mb-4">
              <button
                type="button"
                onClick={() => setIsPopupOpen(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Select Avatar
              </button>
            </p>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <input
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />

              {/* Password Input with Eye Toggle */}
              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <span
                  className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
                {/* Password criteria */}
                <div className="flex flex-wrap gap-3 text-xs mt-2">
                  <p
                    className={
                      passwordCriteria.length
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    8+ chars
                  </p>
                  <p
                    className={
                      passwordCriteria.uppercase
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    1 uppercase
                  </p>
                  <p
                    className={
                      passwordCriteria.lowercase
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    1 lowercase
                  </p>
                  <p
                    className={
                      passwordCriteria.number
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    1 number
                  </p>
                  <p
                    className={
                      passwordCriteria.specialChar
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    1 special (@$!%*?&)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Update
              </button>
            </form>

            {/* Cancel Button */}
            <button
              onClick={closeEditModal}
              className="mt-4 w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg"
            >
              Cancel
            </button>

            {/* Avatar Selection Popup */}
            {isPopupOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-60 md:w-96 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Select Your Avatar
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {avatars.map((avatarObj, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelected(index); // update selected avatar
                          setIsPopupOpen(false);
                        }}
                        className="cursor-pointer py-3 transition-transform transform flex justify-center hover:scale-105"
                      >
                        <img
                          src={avatarObj.src}
                          alt={avatarObj.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="mt-6 w-full bg-gray-200 py-2 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Enter OTP
            </h2>

            {/* OTP Inputs */}
            <div className="flex justify-center space-x-2 mb-6">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 text-center rounded-xl border border-gray-300 shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition text-xl"
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputs.current[index] = el)}
                  />
                ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded-xl shadow-lg transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Verify OTP"}
            </button>

            {/* Resend & Cancel */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-gray-500 underline hover:text-gray-600 transition text-sm font-medium"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>

              <button
                onClick={() => setShowOtpModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
