import { FaXTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/frontend_assets/LogoIcon.png";
import logo from "../assets/frontend_assets/logo.png";

const Footer = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Profile", path: "/profile" },
    { name: "Notifications", path: "/notifications" },
    { name: "Orders", path: "/orders" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 pb-10 sm:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Brand */}
            <div className="flex w-44 h-20 p-3">
              <img
                src={LogoIcon}
                alt="logo"
                className="w-12 h-12 mt-1 md:mt-0 md:w-full md:h-full"
              />
              <img src={logo} alt="logo" />
            </div>

            <p className="text-gray-500 mt-3 max-w-lg leading-7">
              Transform your space with beautiful decor and discover products
              that make every corner feel special.
            </p>

            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-5 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <a
                href={import.meta.env.VITE_TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FaXTwitter size={18} />
              </a>

              <a
                href={import.meta.env.VITE_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href={import.meta.env.VITE_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href={import.meta.env.VITE_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
            <p>© 2025 Decorya. All rights reserved.</p>

            <div className="flex gap-5">
              <Link
                to="/privacy-policy"
                className="hover:text-gray-700 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="hover:text-gray-700 transition"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
