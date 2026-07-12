import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import StarRating from "../pages/products/star";
interface ProductCardProps {
  _id: string;
  name: string;
  photo: string;
  mainPrice: number;
  salePrice: number;
  stock: number;
  rating?: number;
  handler: (cartItem: CartItem) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  name,
  photo,
  mainPrice,
  salePrice,
  rating = 0,
}) => {
  return (
    <article className="relative flex flex-col overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition duration-300 group">
      <Link to={`/product/${_id}`}>
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
          {/* Price & Rating */}
          <div className="mb-2 flex justify-between w-full items-center">
            {/* Price Section */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-base  font-semibold  text-gray-800 ">
                  ₹{mainPrice.toLocaleString()}
                </span>
                {salePrice > 0 && (
                  <span className="text-xs relative bottom-2 line-through text-gray-400">
                    ₹{salePrice.toLocaleString()}
                  </span>
                )}
              </div>

              {salePrice > mainPrice && (
                <span className="text-xs text-green-600 font-medium">
                  {Math.round(((salePrice - mainPrice) / mainPrice) * 100)}% off
                </span>
              )}
            </div>

            {/* Rating Section */}
             {rating > 0 && (
            <div className="flex items-center">
              <StarRating rating={rating} />
            </div>
             )}
          </div>

          {/* Product Name */}
          <h3 className="mb-2 text-sm text-gray-500">
            {name.length > (window.innerWidth > 768 ? 30 : 16)
              ? name.slice(0, window.innerWidth > 768 ? 30 : 16) + "..."
              : name}
          </h3>
        </div>
      </Link>
    </article>
  );
};
export default ProductCard;