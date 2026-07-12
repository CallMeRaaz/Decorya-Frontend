import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useNewReviewMutation } from "../../redux/api/productApi";
import { FaStar, FaTimes } from "react-icons/fa";
import Breadcrumbs from "../../components/breadcrumbs";
import Trackorder from "./trackorder";
import { useToast } from "../../components/context/toastprovider";

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  mobNo: number;
  altMob: number;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface OrderItem {
  name: string;
  photo: string;
  mainPrice: number;
  quantity: number;
  _id: string;
}

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
  updatedAt: string;
  shippingInfo: ShippingInfo;
}

const OrderDetails = () => {
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);

  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [productId, setProductId] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: "Order Details", href: `/order/${id}` },
  ];

  const [createReview] = useNewReviewMutation();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/order/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleSubmitReview = async () => {
    if (
      !user?._id ||
      !user?.name ||
      !user?.avatar ||
      !order?.shippingInfo.city ||
      !reviewRating ||
      !productId ||
      !reviewComment.trim() ||
      !id
    ) {
      showToast("Please ensure all fields are filled out correctly.", "error");
      return;
    }

    setReviewSubmitting(true);

    try {
      // Create the review via mutation (assuming you're using Redux or a mutation hook)
      const res = await createReview({
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        city: order.shippingInfo.city,
        rating: reviewRating,
        comment: reviewComment,
        productId: productId,
      });

      const Mess = res.data?.message; // Check if there's a message returned from the server

      // Handle successful review creation
      if ("data" in res && res.data) {
        showToast(Mess ?? "Review added successfully.", "success");
      }
      // Handle errors from the server
      else if ("error" in res) {
        showToast("Failed to submit review.", "error");
      }
    } catch (error) {
      // Handle any errors from the submission process
      showToast("An error occurred while submitting your review.", "error");
    } finally {
      setIsReviewFormVisible(false); // Hide the form after submission
      setReviewSubmitting(false); // Reset the submitting state
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />{" "}
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-4">Order not found.</div>;
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbData} />
      <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-8">
        <Trackorder />
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-10">
          <div
            // key={index}
            className="border border-gray-200 rounded-xl mb-6 overflow-hidden"
          >
            {/* Left Info + Items */}
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <div className="p-5 w-full  border-b border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Order ID <br />
                    <span className="font-semibold">{order._id}</span>
                  </p>
                  <p className="text-gray-600    text-sm mt-3">
                    Date :{" "}
                    {new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-600 text-sm mt-3">
                    Total Amount <br />
                    <span className="font-semibold">
                      ₹ {order.total.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mt-3 flex items-center gap-2">
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
                  </p>
                  <p className="mt-4">
                    <span
                      className={`px-5 py-2 rounded-3xl font-bold text-white ${
                        order.modeOfPayment === "UPI"
                          ? "bg-gradient-to-r from-pink-400 to-pink-600"
                          : order.modeOfPayment === "COD"
                          ? "bg-gradient-to-r from-orange-400 to-orange-600"
                          : order.modeOfPayment === "CARD"
                          ? "bg-gradient-to-r from-teal-400 to-teal-600"
                          : "bg-gradient-to-r from-gray-500 to-gray-700"
                      }`}
                    >
                      {order.modeOfPayment === "UPI"
                        ? "Unified Payments Interface"
                        : order.modeOfPayment === "COD"
                        ? "Cash on Delivery"
                        : order.modeOfPayment === "CARD"
                        ? "Card"
                        : order.modeOfPayment}
                    </span>
                  </p>
                </div>
                <div className="p-5  border-b sm:border-b-0  border-gray-200">
                  <p className="text-gray-600">
                    Shipping Information <br />
                    <div className="rounded-xl  mt-6">
                      <div className="text-gray-700 leading-relaxed  sm:text-base space-y-1">
                        <p className="text-gray-600 ">
                          Name: <br />
                          <span className="">{order.shippingInfo.name}</span>
                        </p>
                        <p className="text-gray-600 pt-2">
                          Mob: <br />
                          <span className="">{order.shippingInfo.mobNo}</span>
                        </p>
                        <p className="text-gray-600 pt-2 text-sm">
                          Address: <br />
                          <span className="">
                            {order.shippingInfo.address},{" "}
                            {order.shippingInfo.city},{" "}
                            {order.shippingInfo.state},{" "}
                            {order.shippingInfo.country},{" "}
                            {order.shippingInfo.pinCode}
                          </span>
                        </p>
                      </div>
                    </div>
                  </p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:border-l p-5 space-y-5">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between gap-4 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
                  >
                    {/* Left Side: Image + Details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </Link>

                      <div>
                        <p className="font-semibold text-sm">
                          {item.name.length > 18
                            ? item.name.slice(0, 18) + "..."
                            : item.name}
                        </p>

                        <div className="flex gap-3 mt-1 text-sm text-gray-600">
                          <p>Qty: {item.quantity}</p>

                          <p>Price: {item.mainPrice}</p>
                        </div>
                      </div>
                    </div>

                    {order.status === "Delivered" && (
                      <div className="h-16">
                        <button
                          onClick={() => {
                            setProductId(item._id);
                            setIsReviewFormVisible(true);
                          }}
                          className="text-center px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                        >
                          Add Review
                        </button>
                      </div>
                    )}
                    {isReviewFormVisible && productId === item._id && (
                      <div className="fixed inset-0 z-50 px-4 sm:px-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
                        <div className="bg-white rounded-lg w-full max-w-lg p-8">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 ">
                              Create a Review
                            </h3>
                            <button
                              className="text-gray-500 hover:text-gray-700 "
                              onClick={() => setIsReviewFormVisible(false)}
                            >
                              <FaTimes size={24} />
                            </button>
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              Product Id:
                            </label>
                            <input
                              type="text"
                              className="block w-full px-3 py-2 border border-gray-100 outline-none rounded-md bg-gray-100"
                              value={productId}
                              readOnly
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium">
                              Rating:
                            </label>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <label
                                  key={rating}
                                  className="flex items-center space-x-1 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="rating"
                                    value={rating}
                                    className="hidden"
                                    onChange={() => setReviewRating(rating)}
                                    checked={reviewRating === rating}
                                  />

                                  <FaStar
                                    className={`h-6 w-6 ${
                                      reviewRating >= rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium">
                              Comment:
                            </label>
                            <textarea
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={4}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />
                          </div>

                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={handleSubmitReview}
                              disabled={reviewSubmitting}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                              {reviewSubmitting
                                ? "Submitting..."
                                : "Submit Review"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Order Actions */}
                {order.status === "Delivered" && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link to={`/invoice/${order._id}`}>
                      <button className="text-center px-6 mb- bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                        View Invoice
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ))} */}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
