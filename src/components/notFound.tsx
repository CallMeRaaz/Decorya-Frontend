import { useNavigate } from "react-router-dom";
import resetImg from "../assets/frontend_assets/404.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
<div className="fixed inset-0 z-[9999] flex flex-col md:flex-row items-center justify-center bg-gray-50">
  {/* Right Side Image */}
  <div className="w-full p-6 md:w-1/2 mt-8 md:mt-0 flex justify-center">
    <img
      src={resetImg}
      alt="404 Illustration"
      className="w-full max-w-md h-auto object-cover transform hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Left Side Text */}
  <div className="w-full md:w-1/3 p-6 rounded-2xl flex flex-col items-center text-center">
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
      Oops! Page Not Found
    </h2>
    <p className="text-gray-500 mb-6">
      The page you are looking for does not exist, or it has been moved.
    </p>
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

export default NotFound;
