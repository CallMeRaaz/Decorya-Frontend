import { useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useToast } from "../../components/context/toastprovider";

const breadcrumbData = [
  { label: "Home", href: "/" },
  { label: "Payment", href: "/payment" },
  // { label: "Order Details", href: `` },
];

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const verified = useSelector(
    (state: RootState) => state.user.user?.isVerified
  );
  const cartItems = useSelector(
    (state: RootState) => state.cartReducer.cartItems
  );
  const shippingInfo = useSelector(
    (state: RootState) => state.cartReducer.shippingInfo
  );
  const subtotal = useSelector(
    (state: RootState) => state.cartReducer.subtotal
  );
  const discount = useSelector(
    (state: RootState) => state.cartReducer.discount
  );
  const shippingCharges = useSelector(
    (state: RootState) => state.cartReducer.shippingCharges
  );

  // ✅ Free shipping condition
  const appliedShipping = subtotal >= 499 ? 0 : shippingCharges;
  const total = subtotal - discount + appliedShipping;

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };

  // ✅ Redirect if required data missing
  useEffect(() => {
    if (cartItems.length === 0) navigate("/cart");
    else if (!shippingInfo.name) navigate("/shipping");
    else if (!verified) navigate("/profile");
  }, [cartItems, shippingInfo, verified, navigate]);

  // ✅ Submit order
  const submitOrder = async (paymentMethod: string) => {
    const orderData = {
      shippingInfo,
      user: user?._id,
      subtotal,
      discount,
      shippingCharges: appliedShipping,
      total,
      modeOfPayment: paymentMethod,
      status: "Confirmed",
      orderItems: cartItems.map((item) => ({
        name: item.name,
        photo: item.photo,
        mainPrice: item.mainPrice,
        quantity: item.quantity,
        _id: item._id,
      })),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/v1/order/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      await response.json();

      navigate("/confirmation");
      showToast("Order placed successfully!", "success");
    } catch (error) {
      showToast("Failed to place order", "error");
    }
  };

  // ✅ Payment Handlers
  const handleCashOnDelivery = () => submitOrder("COD");
  const handleUPI = () => submitOrder("UPI");
  const handleCard = () => submitOrder("CARD");

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs breadcrumbs={breadcrumbData} />
        <div className=" mx-4 bg-white rounded-2xl my-4 shadow-md p-6 sm:p-10">
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            Order Summary
          </h2>
          <p className="text-gray-600 text-center mt-2">
            {/* Hey, <span className="font-semibold">{order.name}</span> <br />
          Your purchase has been confirmed and will be shipped within 3–4 business days. */}
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Order Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border rounded-xl p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {window.innerWidth < 640
                            ? item.name.length > 13
                              ? item.name.slice(0, 13) + "..."
                              : item.name
                            : item.name.length > 40
                            ? item.name.slice(0, 40) + "..."
                            : item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹ {item.mainPrice}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in the cart.</p>
              )}
            </div>

            {/* Right: Order Details */}
            <div className="space-y-4">
              <div className="border rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-gray-800">
                  {" "}
                  Shipping Information
                </h3>
                <div className="text-sm space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Name: </span>
                    {shippingInfo.name || "-"}
                  </p>
                  <p>
                    <span className="font-medium"> Mobile Number:</span> <br />{" "}
                    {shippingInfo.mobNo || "-"}, {shippingInfo.altMob || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Shipping Address:</span>{" "}
                    <br />
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.state}, {shippingInfo.country},{" "}
                    {shippingInfo.pinCode}
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Order Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span> <span>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span> <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>{" "}
                    <span>
                      {" "}
                      {appliedShipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `₹ ${appliedShipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total:</span> <span>₹ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 gap-5">
                  {["cod", "upi", "card"].map((method, index) => {
                    const isDisabled = method !== "cod";

                    return (
                      <div
                        key={index}
                        onClick={
                          !isDisabled
                            ? () =>
                                handleOptionChange({
                                  target: { value: method },
                                })
                            : undefined
                        }
                        className={`p-5 rounded-lg shadow-lg transform transition ${
                          selectedOption === method && !isDisabled
                            ? "border-2 border-green-500 bg-green-50"
                            : "border border-gray-200 bg-white"
                        } flex justify-between items-center ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="payment-option"
                            value={method}
                            checked={selectedOption === method}
                            onChange={
                              !isDisabled ? handleOptionChange : undefined
                            }
                            disabled={isDisabled}
                            className="w-5 h-5 text-green-500 focus:ring-green-400"
                          />
                          <span className="ml-3 font-medium text-gray-800">
                            {method === "cod"
                              ? "Cash On Delivery"
                              : method === "upi"
                              ? "Pay with UPI (Coming Soon)"
                              : "Debit / Credit Card (Coming Soon)"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Button */}
                {selectedOption === "cod" && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleCashOnDelivery}
                      className="px-6 py-3 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm transition"
                    >
                      Continue with Cash On Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 mb-5 text-center">
            <p className="font-medium text-gray-700">
              Thank you for shopping with us!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
//  className="px-6 py-3 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm transition"
