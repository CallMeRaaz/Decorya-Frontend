import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";
import { setUser } from "../../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../components/context/toastprovider";

import signup from "../../assets/frontend_assets/signup.png";
import A1 from "../../assets/frontend_assets/A1.png";
import A2 from "../../assets/frontend_assets/A2.png";
import A3 from "../../assets/frontend_assets/A3.png";
import A4 from "../../assets/frontend_assets/A4.png";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Avatars array with name and image
  const avatars = [
    { name: "A1", src: A1 },
    { name: "A2", src: A2 },
    { name: "A3", src: A3 },
    { name: "A4", src: A4 },
  ];

  // Password checker
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

  // Form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check avatar selection
    if (selected === null) {
      return showToast("Select an avatar!", "error");
    }

    // Check name length
    if (name.trim().length < 3) {
      return showToast("Name must be at least 3 characters!", "error");
    }

    // Check password criteria
    if (!Object.values(passwordCriteria).every(Boolean)) {
      return showToast("Weak password!", "error");
    }

    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_SERVER}/api/v1/user/new`, {
        avatar: avatars[selected].name,
        name,
        email,
        password,
      })
      .then((response) => {
        const { data } = response;
        if (data?.success) {
          dispatch(setUser(data.user));
          navigate("/profile");
        } else {
          showToast(data?.message || "Something went wrong!", "error");
        }
      })
      .catch((error) => {
        const backendMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again later.";
        showToast(backendMessage, "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen rounded-2xl shadow-2xl pt-20 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 lg:p-20">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex justify-center">
          <div>
            <img
              src={signup}
              alt="Signup Illustration"
              className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <span className="mb-6 text-xs text-gray-600 text-center flex justify-center">
              <p className="text-xs text-gray-600 mt-4">
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-xs underline transition"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="underline transition">
                  Privacy Policy
                </Link>
              </p>
            </span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/3 p-6 md:p-6 bg-white rounded-2xl md:shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Create Account
          </h2>

          {/* Selected Avatar Preview */}
          {selected !== null && (
            <div className="flex justify-center mb-4">
              <img
                src={avatars[selected].src}
                alt={avatars[selected].name}
                className="w-20 h-20 rounded-full object-cover shadow-lg"
              />
            </div>
          )}

          {/* Avatar Selection Button */}
          <p className="text-center mb-6">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Select Avatar
            </button>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div>
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 focus:ring-purple-400 w-full border rounded-xl p-3 focus:outline-none focus:ring-2 shadow-sm transition"
              />
              {name.length > 0 && name.length < 3 && (
                <p className="text-red-500 text-xs mt-1">
                  Name must be at least 3 characters
                </p>
              )}
            </div>

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
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition"
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
              Sign Up
            </button>
          </form>
          <div className="flex justify-between my-5 font- text-gray-600 mx-1">
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>

        {/* Popup Modal */}
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
                      setSelected(index);
                      setIsPopupOpen(false);
                    }}
                    className="cursor-pointer py-3 transition-transform transform flex justify-center"
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
    </>
  );
};

export default SignupForm;
