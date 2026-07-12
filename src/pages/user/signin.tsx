import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";
import { setUser } from "../../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/context/toastprovider";
import Cookie from "js-cookie";

import loginImg from "../../assets/frontend_assets/signin.png"; // can use login illustration

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return showToast("Enter all fields!", "error");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/login`,
        { email, password }
      );

      const { token, user } = response.data;

      // Save token in cookie and localStorage
      Cookie.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);

      // Update Redux store
      dispatch(setUser(user));

      showToast("Login successful!", "success");
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Invalid Email or Password.";
        showToast(errorMessage, "error");
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
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
              />
              <span
                className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between my-5 font- text-gray-600 mx-1">
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex justify-center">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </>
  );
};

export default LoginForm;
