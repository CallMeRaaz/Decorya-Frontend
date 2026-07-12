import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";
import { useToast } from "../../components/context/toastprovider";

import resetImg from "../../assets/frontend_assets/reset-password.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // get token from URL
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return showToast("Enter all fields!", "error");
    }

    if (password !== confirmPassword) {
      return showToast("Passwords do not match!", "error");
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      return showToast("Weak password!", "error");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/reset-password/${token}`,
        { password }
      );

      showToast(
        response.data?.message || "Password reset successful!",
        "success"
      );
      navigate("/login");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "An error occurred",
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
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
              />
              <span
                className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              <div className="flex flex-wrap gap-3 text-xs mt-2">
                <p
                  className={
                    passwordCriteria.length ? "text-green-500" : "text-red-500"
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
                    passwordCriteria.number ? "text-green-500" : "text-red-500"
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Reset Password
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
            src={resetImg}
            alt="Reset Password Illustration"
            className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
