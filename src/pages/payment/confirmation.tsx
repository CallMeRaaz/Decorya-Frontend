import orderConfImg from "../../assets/frontend_assets/orderConf.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetCart } from "../../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const OrderConf = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/cart");
          dispatch(resetCart());
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, dispatch]);

  return (
    <div className=" md:py-12 flex flex-col md:flex-row items-center justify-center bg-white ">
      {/* Right Side Image */}
      <div className="w-full p-6 md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <img
          src={orderConfImg}
          alt="Order Confirmed Illustration"
          className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500 drop-shadow-xl"
        />
      </div>

      {/* Left Side Text */}
      <div className="w-full md:w-1/3 p-6 rounded-2xl flex flex-col items-center text-center bg-white">
        <div className="flex flex-col items-center justify-center mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-3">
            Order Confirmed!
          </h2>
        </div>

        <p className="text-gray-600 mb-4">
          Thank you for your purchase. <br /> Your order has been successfully
          placed.
        </p>

        <div className="bg-gray-100 px-4 py-2 rounded-md text-gray-600 text-sm mb-4">
          You’ll be redirected to your{" "}
          <span className="font-semibold text-indigo-600">cart</span> in{" "}
          <span className="font-bold text-gray-800">{seconds}</span> seconds...
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default OrderConf;
