import { useEffect, useState } from "react";

const BannerNotification = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Hide after 10 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-full flex justify-center transition-all duration-700 ${
        show ? "opacity-100 py-3" : "opacity-0 max-h-0 py-0"
      } overflow-hidden`}
    >
      <div className="bg-black w-full text-white px-6 py-3 text-center">
        Free Shipping on ₹499
      </div>
    </div>
  );
};

export default BannerNotification;
