import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs";
import { Key, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addToCart,
  calculatePrice,
  removeCartItem,
} from "../../redux/reducer/cartReducer";
import { CartItem } from "../../types/types";
import CartItems from "../../components/cart-iems";
import { FaShoppingCart } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";
import axios from "axios";
import { discountApplied } from "../../redux/reducer/cartReducer";

interface Coupon {
  _id: string;
  code: string;
  amount: number;
  expiryDate: string;
  minPurchaseAmount: number;
  active: boolean;
  __v: number;
}
interface SelectedCoupon {
  code: string;
  discount: number;
  minPurchaseAmount: number;
}

const Carts = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [, setLoading] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const [selectedCoupon, setSelectedCoupon] = useState<SelectedCoupon | null>(
    null
  );

  const { cartItems, discount, shippingCharges } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: `Cart - ${cartItems.length}`, href: "/cart" },
  ];

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/all`
        );
        setCoupons(response.data.coupons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);
  useEffect(() => {
    const subtotal = calculateSubtotal();
    if (selectedCoupon && subtotal < selectedCoupon.minPurchaseAmount) {
      dispatch(discountApplied(0));
      showToast(
        `Coupon ${selectedCoupon.code} removed. Minimum purchase ₹${selectedCoupon.minPurchaseAmount} required.`,
        "info"
      );
      setAppliedCoupon(null);
      setSelectedCoupon(null);
      localStorage.removeItem("appliedCoupon");
    }
  }, [cartItems]);

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      const parsed: SelectedCoupon = JSON.parse(savedCoupon);
      const subtotal = calculateSubtotal();
      if (subtotal >= parsed.minPurchaseAmount) {
        setSelectedCoupon(parsed);
        setAppliedCoupon({ code: parsed.code, discount: parsed.discount });
        dispatch(discountApplied(parsed.discount));
      } else {
        // remove invalid coupon
        localStorage.removeItem("appliedCoupon");
        dispatch(discountApplied(0));
      }
    }
  }, []);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  const applyDiscount = async (
    code: string,
    discount: number,
    minPurchaseAmount: number
  ) => {
    try {
      if (cartItems.length === 0) {
        showToast("Your cart is empty.", "error");
        return;
      }

      const subtotal = calculateSubtotal();

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/discount`,
        { params: { coupon: code, subtotal } }
      );

      const { success } = response.data;

      if (!success) {
        showToast("Invalid or expired coupon.", "error");
        return;
      }

      // Apply discount
      dispatch(discountApplied(discount));
      setSelectedCoupon({ code, discount, minPurchaseAmount });
      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({ code, discount, minPurchaseAmount })
      );
      setAppliedCoupon({ code, discount });
      setShowCouponModal(false);

      showToast(`Coupon ${code} applied! ₹${discount} off 🎉`, "success");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 400
          ? "This coupon cannot be applied."
          : "Failed to apply coupon. Try again.");
      showToast(message, "error");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.mainPrice * item.quantity,
      0
    );
  };
  const incrementHandler = (cartItem: CartItem) => {
    const availableStock = cartItem.stock ?? 0;
    if (cartItem.quantity >= availableStock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (_id: string) => {
    dispatch(removeCartItem(_id));
  };

  const calculatedSubtotal = calculateSubtotal();

  const appliedShippingCharges =
    calculatedSubtotal >= 499 ? 0 : shippingCharges;

  const finalTotal = calculatedSubtotal - discount + appliedShippingCharges;

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbData} />

      <section className="bg-white antialiased">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          {cartItems.length === 0 ? (
            // ✅ Show only Empty Cart when cart is empty
            <div className="flex flex-col items-center justify-center !p-0 my-24 bg-white rounded-lg">
              <div className="bg-white  p-8 text-center w-full max-w-md">
                <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven’t added anything yet. Start shopping now!
                </p>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-600 transition-transform transform hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            // ✅ Show cart items and summary only when cart has products
            <div className="mt-1 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                <div className="space-y-6">
                  {cartItems.map((item: any, idx: Key) => (
                    <CartItems
                      key={idx}
                      cartItem={item}
                      incrementHandler={incrementHandler}
                      decrementHandler={decrementHandler}
                      removeHandler={removeHandler}
                    />
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-5 lg:mt-0 lg:w-full">
                <div className="border border-gray-200 w-full rounded-xl p-4 flex justify-between items-center shadow-sm transition hover:shadow-md">
                  {appliedCoupon ? (
                    <>
                      <div>
                        <p className="font-semibold text-base text-green-600">
                          {appliedCoupon.code} Applied 🎉
                        </p>
                        <p className="text-sm text-gray-600">
                          • ₹{appliedCoupon.discount} off applied successfully
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setAppliedCoupon(null);
                          setSelectedCoupon(null);
                          localStorage.removeItem("appliedCoupon");
                          dispatch(discountApplied(0));
                          showToast("Coupon removed.", "info");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div
                      className="w-full text-center"
                      onClick={() => setShowCouponModal(true)}
                    >
                      <p className="text-gray-600 text-sm font-medium">
                        No coupon applied
                      </p>
                      <p className="text-gray-400 text-xs font-semibold mt-1">
                        Tap here to view available coupons
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                  <p className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">
                          Subtotal
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          ₹{calculatedSubtotal.toFixed(2)}
                        </dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">
                          Discount
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          -₹{discount.toFixed(2)}
                        </dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">
                          Delivery Charges
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          {appliedShippingCharges === 0 ? (
                            <span className="text-green-600 font-medium">
                              Free
                            </span>
                          ) : (
                            `₹${appliedShippingCharges.toFixed(2)}`
                          )}
                        </dd>
                      </dl>

                      <hr className="my-2 border-gray-200" />

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-semibold text-gray-900">
                          Total
                        </dt>
                        <dd className="text-base font-semibold text-gray-900">
                          ₹{finalTotal.toFixed(2)}
                        </dd>
                      </dl>
                    </div>

                    <Link
                      to="/shipping"
                      className="flex w-full items-center justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 transition"
                    >
                      Proceed to Shipping Address
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {showCouponModal && (
          <div className="fixed px-6 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white w-96 max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl p-6 space-y-4 relative animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Available Coupons
              </h2>

              {coupons.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No coupons available.
                </p>
              ) : (
                coupons.map((c) => {
                  const subtotal = calculateSubtotal();
                  const isExpired = new Date(c.expiryDate) < new Date();
                  const isDisabled =
                    subtotal < c.minPurchaseAmount || isExpired || !c.active;

                  return (
                    <div
                      key={c._id}
                      className={`border rounded-xl p-4 flex justify-between items-center transition ${
                        isDisabled
                          ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                          : "border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-semibold text-lg ${
                            isDisabled ? "text-gray-500" : "text-blue-600"
                          }`}
                        >
                          {c.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{c.amount} off • Min ₹{c.minPurchaseAmount}
                        </p>
                        <p
                          className={`text-xs ${
                            isExpired ? "text-red-500" : "text-gray-400"
                          }`}
                        >
                          {isExpired
                            ? "Expired"
                            : `Expires: ${new Date(
                                c.expiryDate
                              ).toLocaleDateString()}`}
                        </p>
                      </div>

                      <button
                        disabled={isDisabled}
                        onClick={() =>
                          applyDiscount(c.code, c.amount, c.minPurchaseAmount)
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          isDisabled
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {isExpired
                          ? "Expired"
                          : isDisabled
                          ? "Not Eligible"
                          : "Apply"}
                      </button>
                    </div>
                  );
                })
              )}

              <button
                onClick={() => setShowCouponModal(false)}
                className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Carts;
