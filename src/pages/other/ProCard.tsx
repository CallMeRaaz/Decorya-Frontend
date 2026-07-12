import { useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaEye } from "react-icons/fa";
const ProductCard = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white mt-10 rounded-2xl shadow-md hover:shadow-lg transition p-4 relative">
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaHeart
            className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}
          />
        </button>
        <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
          <FaEye className="text-xl text-gray-500" />
        </button>
      </div>

      <div className="flex justify-center mb-3">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTerZZxYwe5-icQtLPDUvubRb3JGR8yK1BV6w&s"
          alt="Asus ZenBook 14"
          className="h-40 object-contain"
        />
      </div>

      <div className="space-y-2">
        <div className="flex">
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
          <FaRegStar className="text-yellow-400" />
        </div>

        <h3 className="font-semibold text-lg">Asus ZenBook 14</h3>

        <p className="text-gray-500 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque culpa,
          odio, qui...
        </p>

        <span className="inline-block bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-md">
          IN STOCK
        </span>

        <p className="text-lg font-bold mt-3">₹ 37.00</p>
      </div>
    </div>
  );
};
export default ProductCard;