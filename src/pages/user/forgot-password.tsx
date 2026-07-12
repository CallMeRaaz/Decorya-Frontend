import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";
import { useToast } from "../../components/context/toastprovider";

import loginImg from "../../assets/frontend_assets/forgot-password.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      return showToast("Enter your email!", "error");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/forgot-password`,
        { email }
      );

      // Show success message
      showToast(
        response.data?.message || "Password reset link sent!",
        "success"
      );

      // Redirect if needed
      navigate("/");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "An error occurred. Try again.",
          "error"
        );
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen rounded-2xl shadow-2xl pt-20 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 lg:p-20">
        {/* Left Side Form */}
        <div className="w-full md:w-1/3 p-6 md:p-6 bg-white rounded-2xl md:shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Send Reset Link
            </button>
          </form>

          <div className="flex justify-between my-5 text-gray-600 mx-1">
            <Link
              to="/login"
              className="underline hover:text-purple-500 transition"
            >
              Back to Login
            </Link>
            <Link
              to="/signup"
              className="underline hover:text-purple-500 transition"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex justify-center">
          <img
            src={loginImg} // your forgot password illustration
            alt="Forgot Password Illustration"
            className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
