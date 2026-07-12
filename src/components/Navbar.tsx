import { useSelector } from "react-redux";
import LogoIcon from "../assets/frontend_assets/LogoIcon.png";
import logo from "../assets/frontend_assets/logo.png";
import { User } from "../types/types";
import { RootState } from "../redux/store";
import cart from "../assets/frontend_assets/cart_icon.png";
import search from "../assets/frontend_assets/search_icon.png";
import login from "../assets/frontend_assets/login.png";

import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaHeart,
  FaUser,
  FaBoxOpen,
  FaPlus,
  FaClipboardList,
  FaBell,
  FaPhoneAlt,
  FaUserShield,
  FaShoppingBag,
  FaRegBell,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PropsTypes {
  user: Partial<User> | null;
}
const BottomNavItem = ({
  to,
  icon,
  active,
  activeColor,
  inactiveColor,
  bgColor,
}: {
  to?: string;
  icon: JSX.Element;
  active?: boolean;
  activeColor: string;
  inactiveColor: string;
  bgColor: string;
}) => (
  <Link
    to={to || "/"}
    className="relative flex flex-col items-center justify-center transition-all duration-500 ease-in-out"
  >
    <div
      className={`p-3 rounded-full text-lg transform transition-all duration-500 ease-in-out ${
        active
          ? `translate-y-[-1rem] scale-110 ${bgColor} ${activeColor}`
          : `translate-y-0 scale-100 ${inactiveColor}`
      }`}
    >
      {icon}
    </div>
  </Link>
);

const Header = ({ user }: PropsTypes) => {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const userRole = user?.role ?? "user";

  useEffect(() => {
    if (location.pathname === "/") setSelectedTab("home");
    else if (location.pathname.includes("/products"))
      setSelectedTab("products");
    else if (location.pathname.includes("/wishlist"))
      setSelectedTab("wishlist");
    else if (location.pathname.includes("/profile")) setSelectedTab("profile");
    else setSelectedTab("");
  }, [location.pathname]);

  return (
    <>

      <nav className="flex fixed py-8 z-10 shadow-md bg-white w-full justify-between items-center mx-auto px-2 md:px-5 h-20">
        {/* Left Logo */}
        <div className="inline-flex">
          <Link className="_o6689fn " to="/">
            <div className="md:block">
              <div className="flex w-44 h-20 p-3">
                <img
                  src={LogoIcon}
                  alt="logo"
                  className="w-12 h-12 mt-1 md:mt-0 md:w-full md:h-full"
                />
                <img src={logo} alt="logo" />
              </div>
            </div>
          </Link>
        </div>

        {/* Middle Nav Links */}
        <div className="hidden md:flex flex-shrink flex-grow-0 justify-start px-2">
          <div className="inline-block">
            <div className="inline-flex items-center max-w-full gap-6 text-sm font-medium">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/contact", label: "Contact" },
                { to: "/wishlist", label: "Wishlist" },
                { to: "/profile", label: "Profile" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative pb-1 transition-all duration-300 ${
                      isActive
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:translate-x-[-50%] after:w-[130%] after:h-[3px] after:bg-gradient-to-r after:from-indigo-500 after:via-purple-500 after:to-pink-500 after:rounded-full"
                        : "text-gray-800 hover:text-gray-600 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:translate-x-[-50%] after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-indigo-500 after:via-purple-500 after:to-pink-500 after:rounded-full hover:after:w-[130%] after:transition-all after:duration-300"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex-initial">
          <div className="flex justify-end items-center relative">
            <div className="flex mr-2 items-center">
              {/* Search */}
              <Link to="/search">
                <button
                  type="button"
                  className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
                >
                  <img
                    src={search}
                    alt="search"
                    className="w-4 cursor-pointer"
                  />
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <button
                  type="button"
                  className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
                >
                  <img src={cart} alt="cart" className="w-4 cursor-pointer" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="inline-flex items-center px-1.5 py-0.3 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-orange-500 text-white">
                        {cartItems.length}
                      </div>
                    </span>
                  )}
                </button>
              </Link>
              <Link to="/notifications">
                <button
                  type="button"
                  className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
                >
                  <FaRegBell className="text-lg" />
                </button>
              </Link>

              {/* Login */}
              {!user?._id && (
                <button
                  type="button"
                  className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative"
                >
                  <Link to="/login" className="relative">
                    <img
                      src={login}
                      alt="login"
                      className="w-5 cursor-pointer"
                    />
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside className="fixed bottom-0 left-0 w-full z-[999] md:hidden p-">
        <div className="relative bg-white flex justify-around items-center py-3 rounded-t-2xl">
          <BottomNavItem
            to="/"
            icon={<FaHome />}
            active={selectedTab === "home"}
            bgColor="bg-blue-100"
            // bgColor="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"
            activeColor="text-blue-600"
            inactiveColor="text-gray-600"
          />
          <BottomNavItem
            to="/products"
            icon={<FaBoxOpen />}
            active={selectedTab === "products"}
            bgColor="bg-green-100"
            activeColor="text-green-600"
            inactiveColor="text-gray-600"
          />
          <BottomNavItem
            to="/wishlist"
            icon={<FaHeart />}
            active={selectedTab === "wishlist"}
            bgColor="bg-red-100"
            activeColor="text-red-600"
            inactiveColor="text-gray-600"
          />
          <BottomNavItem
            to="/profile"
            icon={<FaUser />}
            active={selectedTab === "profile"}
            bgColor="bg-purple-100"
            activeColor="text-purple-600"
            inactiveColor="text-gray-600"
          />

          <div
            className="relative flex flex-col items-center justify-center"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            {/* Plus button */}
            <div
              className={`p-3 rounded-full text-lg cursor-pointer transition-all duration-500 transform ${
                moreOpen
                  ? "bg-pink-100 text-pink-600 rotate-45 translate-y-[-1rem] scale-110"
                  : "text-gray-700"
              }`}
            >
              <FaPlus />
            </div>

            <div
              className={`absolute  flex transition-all duration-500 ease-out origin-bottom-right ${
                moreOpen
                  ? "opacity-100 translate-y-[-1rem] pointer-events-auto"
                  : "opacity-0 translate-y-0 pointer-events-none"
              }`}
              style={{
                bottom: "-7.5rem",
                right: "-8rem",
                width: "10rem",
                height: "10rem",
              }}
            >
              <div className="relative w-full h-full">
                <Link
                  to="/orders"
                  className={`absolute bg-purple-100 hover:bg-purple-200 text-purple-600 p-3 rounded-full shadow-md transform transition-all duration-500 hover:scale-110 ${
                    moreOpen
                      ? "translate-x-[-2.5rem] translate-y-[-8.5rem] opacity-100"
                      : "translate-x-0 translate-y-0 opacity-0"
                  }`}
                >
                  <FaClipboardList className="text-lg" />
                </Link>
                <Link
                  to="/notifications"
                  className={`absolute bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-full shadow-md transform transition-all duration-500 hover:scale-110 ${
                    moreOpen
                      ? "translate-x-[-5.5rem] translate-y-[-6.5rem] opacity-100"
                      : "translate-x-0 translate-y-0 opacity-0"
                  }`}
                >
                  <FaBell className="text-lg" />
                </Link>
                <Link
                  to="/contact"
                  className={`absolute bg-green-100 hover:bg-green-200 text-green-600 p-3 rounded-full shadow-md transform transition-all duration-500 hover:scale-110 ${
                    moreOpen
                      ? "translate-x-[-7rem] translate-y-[-3.5rem] opacity-100"
                      : "translate-x-0 translate-y-0 opacity-0"
                  }`}
                >
                  <FaPhoneAlt className="text-base" />
                </Link>
                {userRole === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className={`absolute bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-full shadow-md transform transition-all duration-500 hover:scale-110 ${
                      moreOpen
                        ? "translate-x-[-3rem] translate-y-[-4rem] opacity-100"
                        : "translate-x-0 translate-y-0 opacity-0"
                    }`}
                  >
                    <FaUserShield className="text-lg" />
                  </Link>
                )}
                {userRole === "user" && (
                  <Link
                    to="/cart"
                    className={`absolute bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-full shadow-md transform transition-all duration-500 hover:scale-110 ${
                      moreOpen
                        ? "translate-x-[-3rem] translate-y-[-4rem] opacity-100"
                        : "translate-x-0 translate-y-0 opacity-0"
                    }`}
                  >
                    <FaShoppingBag className="text-lg" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
