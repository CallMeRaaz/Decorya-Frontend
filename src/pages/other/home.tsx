import { useEffect, useState } from "react";
import axios from "axios";

import { useLatestProductsQuery } from "../../redux/api/productApi";

import { motion } from "framer-motion";

import Loader from "../../components/loader.js";
import ban1 from "../../assets/frontend_assets/delivery.png";
import ban2 from "../../assets/frontend_assets/return.png";
import ban3 from "../../assets/frontend_assets/support.png";
import ban4 from "../../assets/frontend_assets/bestPrice.png";
import testmonials from "../../assets/frontend_assets/testmonials.png";
import Banner1 from "../../assets/frontend_assets/SECban.jpg";
import Banner2 from "../../assets/frontend_assets/BANNWALL2.jpg";

import CouBanner from "../../assets/frontend_assets/CouBanner.jpg";
import BecBanner from "../../assets/frontend_assets/BecBanner.jpg";

import "../../components/css/style.css";
import "../../components/css/responsive.css";
import { useToast } from "../../components/context/toastprovider.js";
import A1 from "../../assets/frontend_assets/A1.png";
import A2 from "../../assets/frontend_assets/A2.png";
import A3 from "../../assets/frontend_assets/A3.png";
import A4 from "../../assets/frontend_assets/A4.png";
import userPNG from "../../assets/frontend_assets/userPNG.png";
import Categories from "./Categories.js";
import HomeBanners from "./HomeBanners.js";
import { useImagePreloader } from "../../components/context/imgloader.js";
import FAQ from "./FAQs.js";

interface Banner {
  img: string;
  title: string;
  subtitle: string;
  mainPrice: number;
  link: string;
}
interface IContact {
  _id: string;
  avatar: string;
  name?: string;
  email: string;
  subject: string;
  message: string;
  messageCreatedAt: string;
  reply?: string;
  replyCreatedAt?: string | null;
  status: "Pending" | "Replied";
}

const Banner = () => {
  const [, setBannerData] = useState<Banner[]>([]);
  const [, setLoading] = useState(true);
  const { showToast } = useToast();
  const [messages, setMessages] = useState<IContact[]>([]);

  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const {  isError } = useLatestProductsQuery("");

  if (isError) showToast("Cannot Fetch the Products", "error");


  const imagesToPreload = [
    Banner1,
    Banner2,
    ban1,
    ban2,
    ban3,
    ban4,
    testmonials,
    CouBanner,
    BecBanner,
    A1,
    A2,
    A3,
    A4,
    userPNG,
  ];

  const imagesLoaded = useImagePreloader(imagesToPreload);
  // -------------------- Fetch Banner Data --------------------
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/banner/all`
        );
        setBannerData(response.data.banners);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setLoading(false); // Ensure loading is false after fetch attempt
      }
    };

    fetchBannerData();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/contact/messages`
      );
      setMessages(response.data);
    } catch (err) {
      showToast("Failed to fetch messages.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
  const alreadySeen = localStorage.getItem("decoryaWelcome");

  if (!alreadySeen) {
    setTimeout(() => {
      setShowWelcomePopup(true);
      localStorage.setItem("decoryaWelcome", "true");
    }, 500);
  }
}, []);


  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="md:pt-28 pt-10 ">
        <HomeBanners />

        <Categories />

        <section className="dual-banners py-10 px-4 md:px-10">
          <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <motion.div
              className="relative rounded-2xl overflow-hidden w-full h-[250px] sm:h-[300px] md:h-[380px] lg:h-[420px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img
                src={Banner1}
                alt="Decor Collection"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
            </motion.div>

            {/* Banner 2 */}
            <motion.div
              className="relative rounded-2xl overflow-hidden w-full h-[250px] sm:h-[300px] md:h-[380px] lg:h-[420px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={Banner2}
                alt="Lighting Decor"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* <section>
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <section className="bg-white text-gray-700">
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                  <div className="pt-8 flex justify-center">
                    <h1 className="text-center text-2xl md:text-3xl font-bold relative inline-block select-none">
                      Latest products
                      <span className="block mx-auto w-16 md:w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-2 rounded"></span>
                    </h1>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
                    {data?.products.map((product) => {
                      const photoUrl =
                        product.photo && product.photo.length > 0
                          ? `${
                              import.meta.env.VITE_SERVER
                            }/${product.photo[0].replace(/\\/g, "/")}`
                          : "/placeholder.png";

                      return (
                        <ProductCard
                          key={product._id}
                          _id={product._id}
                          name={product.name}
                          photo={photoUrl}
                          mainPrice={product.mainPrice}
                          salePrice={product.salePrice}
                          stock={product.stock}
                          rating={product.ratings}
                          handler={addToCartHandler}
                        />
                      );
                    })}
                  </div>
                </div>
                <Link to="/products" className="flex justify-center my-5 mb-8">
                  <button
                    className="relative text-black font-semibold  text-md px-6 py-2 select-none
             bg-transparent transition-colors hover:text-black
             after:content-[''] after:absolute after:left-1/2 after:-bottom-1 
             after:h-[2px] after:w-10 after:-translate-x-1/2 
             after:bg-gradient-to-r after:from-pink-500 after:via-purple-500 after:to-indigo-500
             after:transition-all after:duration-300 hover:after:w-28"
                  >
                    <div className="flex">
                      <span>View More</span>

                      <img
                        className="w-3.5 h-3.5 top-1.5 left-1 relative"
                        src={next}
                        alt=""
                      />
                    </div>
                  </button>
                </Link>
              </section>
            )}
          </div>
        </section> */}

        <section className="p-5 pb-16 flex flex-col md:flex-row gap-5 items-center justify-center">
          <motion.img
            src={CouBanner}
            alt="Banner"
            className="rounded-lg w-full md:w-1/2 h-44 md:h-64 object-cover shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />

          <motion.img
            src={BecBanner}
            alt="Banner"
            className="rounded-lg w-full md:w-1/2 h-44 md:h-64 object-cover shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          />
        </section>

        <section className="relative min-h-screen bg-gray-50 text-gray-800">
          {/* Background image section */}
          <div className="absolute inset-0 ">
            <img
              src={testmonials}
              className="w-full h-full object-cover opacity-20 "
            />
          </div>

          {/* Overlay content */}
          <div className="relative max-w-6xl mx-auto py-20 px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Stories
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                These are some heartfelt testimonials from users who love using
                our platform.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {messages.slice(0, 6).map((msg) => (
                <div
                  key={msg._id}
                  className="relative  shadow-lg rounded-3xl border border-gray-100 hover:shadow-2xl transition-all"
                >
                  <p className="text-gray-700 bg-white px-6 rounded-3xl py-6 mb-5 text-sm leading-relaxed">
                    “{msg.message}”
                  </p>
                  <div className="absolute left-7 bottom-16 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white block md:hidden"></div>

                  <div className="flex items-center gap-4">
                    <img
                      src={
                        msg.avatar === "A1"
                          ? A1
                          : msg.avatar === "A2"
                          ? A2
                          : msg.avatar === "A3"
                          ? A3
                          : msg.avatar === "A4"
                          ? A4
                          : userPNG
                      }
                      alt={msg.avatar}
                      className="w-12 h-12 rounded-full object-cover border-2 mb-1 ml-1 border-indigo-300"
                    />
                    <div className=" w-full mr-5">
                      <h4 className="font-semibold text-gray-900  w-full text-sm">
                        {msg.name}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {new Date(msg.messageCreatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        •{" "}
                        {new Date(msg.messageCreatedAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Quote bubble triangle */}
                  <div className="absolute top-3 left-3 w-4 h-4 bg-indigo-100 rounded-full opacity-50 blur-sm"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-10 bg-gray-50">
          <div className=" mx-auto px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Free Shipping */}
              <div className=" flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg  ">
                <img
                  src={ban1}
                  alt="Free Shipping"
                  className="w-10 ml-5 my-2 h-10"
                />
                <div>
                  <h4 className="text-base font-semibold">Free Shipping</h4>
                  <p className="text-gray-600 text-sm">
                    On orders ₹499 & above
                  </p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className=" flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg  ">
                <img
                  src={ban2}
                  alt="Cash on Delivery"
                  className="w-10 ml-5 my-2 h-10"
                />
                <div>
                  <h4 className="text-base font-semibold">Cash on Delivery</h4>
                  <p className="text-gray-600 text-sm">
                    Available on all orders
                  </p>
                </div>
              </div>

              {/* Secure Checkout */}
              <div className=" flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg  ">
                <img
                  src={ban3}
                  alt="Secure Checkout"
                  className="w-10 ml-5 my-2 h-10"
                />
                <div>
                  <h4 className="text-base font-semibold">Secure Checkout</h4>
                  <p className="text-gray-600 text-sm">
                    Safe & verified process
                  </p>
                </div>
              </div>

              {/* Best Price */}
              <div className="s flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg  ">
                <img
                  src={ban4}
                  alt="Best Price"
                  className="w-10 ml-5 my-2 h-10"
                />
                <div>
                  <h4 className="text-base font-semibold">Best Price</h4>
                  <p className="text-gray-600 text-sm">Guaranteed deals</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <FAQ />

      {showWelcomePopup && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="relative overflow-hidden bg-white rounded-[32px] w-full max-w-md shadow-2xl">

      {/* Gradient Top */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center text-white">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-4xl">
          ✨
        </div>

        <h2 className="text-3xl font-bold mb-2">
          Welcome to Decorya
        </h2>

        <p className="text-orange-50 text-sm">
          Stay tuned for exciting offers, order updates and special announcements.
        </p>
      </div>

      {/* Body */}
      <div className="p-8 text-center">
        <p className="text-gray-600 leading-7 mb-6">
          Discover amazing deals, exclusive coupons and keep track of all your
          orders in one place.
        </p>

        <button
          onClick={() => setShowWelcomePopup(false)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          Explore Decorya 🚀
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-30" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30" />
    </div>
  </div>
)}

    </>
  );
};

export default Banner;
