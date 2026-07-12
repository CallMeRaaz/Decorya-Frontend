import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaImage,
  FaShoppingBag,
  FaFileAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface NavItemProps {
  icon: JSX.Element;
  active: boolean;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, active, to }) => (
  <Link
    to={to}
    className={`flex items-center justify-center p-3 rounded-md transition-all duration-150 ${
      active
        ? "bg-green-100 text-green-600"
        : "text-gray-500 hover:bg-gray-100 hover:text-green-600"
    }`}
  >
    <span className="text-xl">{icon}</span>
  </Link>
);

export default function AdminDashboard() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    // Automatically set active tab based on URL path
    if (location.pathname.includes("/admin/dashboard")) setSelectedTab("overview");
    else if (location.pathname.includes("/admin/product")) setSelectedTab("products");
    else if (location.pathname.includes("/admin/transaction")) setSelectedTab("orders");
    else if (location.pathname.includes("/admin/customer")) setSelectedTab("customers");
    else if (location.pathname.includes("/admin/contact")) setSelectedTab("contact");
    else if (location.pathname.includes("/admin/app/coupon")) setSelectedTab("coupon");
  }, [location.pathname]);

  return (
    <aside className="fixed z-[999] px-4 pb-4 left-0 bottom-0 w-full sm:w-16 sm:h-full sm:flex sm:flex-col sm:justify-end bg-white border-t sm:border-t-0 sm:border-r border-gray-200 shadow-sm">
      <nav className="flex sm:flex-col justify-around sm:justify-end sm:space-y-4 p-2">
        <NavItem
          icon={<FaHome />}
          active={selectedTab === "overview"}
          to="/admin/dashboard"
        />
        <NavItem
          icon={<FaBox />}
          active={selectedTab === "products"}
          to="/admin/product"
        />
        <NavItem
          icon={<FaShoppingBag />}
          active={selectedTab === "orders"}
          to="/admin/transaction"
        />
        <NavItem
          icon={<FaUsers />}
          active={selectedTab === "customers"}
          to="/admin/customer"
        />
        <NavItem
          icon={<FaFileAlt />}
          active={selectedTab === "contact"}
          to="/admin/contact"
        />
        <NavItem
          icon={<FaImage />}
          active={selectedTab === "coupon"}
          to="/admin/app/coupon"
        />
      </nav>
    </aside>
  );
}
