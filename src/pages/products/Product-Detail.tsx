import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs";
import userPNG from "../../assets/frontend_assets/userPNG.png";
import Loader from "../../components/loader";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { CartItem } from "../../types/types";
import { addToCart } from "../../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import StarRating from "./star";
import RelatedProduct from "./RelatedProduct";
import { useToast } from "../../components/context/toastprovider";
import A1 from "../../assets/frontend_assets/A1.png";
import A2 from "../../assets/frontend_assets/A2.png";
import A3 from "../../assets/frontend_assets/A3.png";
import A4 from "../../assets/frontend_assets/A4.png";

interface Review {
  updatedAt: string | number | Date;
  _id: string;
  name: string;
  avatar: string;
  city: string;
  rating: number;
  comment: string;
  numOfReviews: number;
  ratings: number;
}
interface Product {
  reviews: Review[] | null;
}
interface RatingCount {
  [key: string]: number;
}
interface ProductCardProps {
  _id: string;
  name: string;
  photo: string;
  mainPrice: number;
  stock: number;
  handler: (cartItem: CartItem) => void;
}
interface Product {
  _id: string;
  name: string;
  photo: string[];
  salePrice: number;
  onSale: boolean;
  mainPrice: number;
  stock: number;
  category: string;
  description: string;
  ratings: number;
  numOfReviews: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews: Review[] | null;
}
const ProductCard: React.FC<ProductCardProps> = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const [ratingCount, setRatingCount] = useState<RatingCount>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (reviews.length > 0) {
      const ratingsObj: RatingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      reviews.forEach((r) => {
        const key = Math.round(r.rating);
        if (ratingsObj[key] !== undefined) ratingsObj[key] += 1;
      });

      setRatingCount(ratingsObj);

      const avg =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      setAverageRating(avg);
    }
  }, [reviews]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/product/${id}`
        );
        setProduct(response.data.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/product/reviews/${id}`
        );
        const { reviews, numOfReviews, ratings } = response.data;
        setNumOfReviews(numOfReviews); // Create a useState for this
        setRatings(ratings); // Create a useState for this

        setReviews(reviews);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    // Check if the product is already in the wishlist
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === (product?.photo.length ?? 1) - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [product]);

  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    {
      label: product ? `${product.name?.slice(0, 18)}...` : "Loading...", // fallback label if product is null
      href: `/product/${id}`,
    },
  ];

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isWishlisted) {
      // Remove product from wishlist
      const updatedWishlist = wishlist.filter(
        (productId: string) => productId !== id
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } else {
      // Add product to wishlist
      wishlist.push(id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === product.photo.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? product.photo.length - 1 : prevIndex - 1
    );
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      photo: product.photo[0],
      mainPrice: product.mainPrice,
      stock: product.stock,
      quantity, // ✅ uses selected quantity
      category: product.category || "",
    };

    dispatch(addToCart(cartItem));
    showToast(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`,
      "success"
    );
  };

  return (
    <div>

      <Breadcrumbs breadcrumbs={breadcrumbData} />

      <section className="max-w-screen">
        <div className="m-4 mx-auto max-w-screen-lg rounded-md  border-gray-100 text-gray-600">
          <div className="relative flex h-full flex-col text-gray-600 md:flex-row">
            <div className="mx-auto sm:w-1/2 flex flex-col items-center px-5 pt-1 md:p-8">
              {/* <div> */}
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${selectedImageIndex * 100}%)`,
                  }}
                >
                  <div className="flex transition-transform duration-300">
                    {product.photo.map((img, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-full aspect-square overflow-hidden"
                      >
                        <img
                          src={`${import.meta.env.VITE_SERVER}/${img}`}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 border text-white rounded-full px-4 p-2 mx-2"
                  onClick={handlePreviousImage}
                >
                  &lt; {/* Previous button */}
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border text-white rounded-full px-4 p-2 mx-2"
                  onClick={handleNextImage}
                >
                  &gt; {/* Next button */}
                </button>
              </div>

              <div className="flex flex-col bg-white w-full ">
                <div className="flex overflow-x-scroll hide-scroll-bar">
                  <div className="flex flex-nowrap justify-between">
                    {product.photo.map((photo, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`flex-0 aspect-square mb-3 mx-1 w-14 my-2 overflow-hidden rounded-sm border-2
                           ${
                             selectedImageIndex === index
                               ? "border-gray-900"
                               : "border-transparent"
                           } text-center`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={`${import.meta.env.VITE_SERVER}/${photo}`}
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-8 md:w-4/6 bg-white rounded-2xl shadow-sm">
              {product.onSale && (
                <h4 className="mb-4 text-sm font-black flex items-center">
                  <span className="bg-green-500 text-white py-1 px-3 rounded">
                    On Sale
                  </span>
                </h4>
              )}

              {/* Product Title */}
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h2>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center text-2xl transition-all duration-200 ${
                    isWishlisted
                      ? "text-rose-500"
                      : "text-gray-300 hover:text-rose-400"
                  }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={ratings} />
                <span className="text-sm text-gray-500">
                  ({numOfReviews} reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{product.mainPrice}
                </p>
                {product.salePrice && (
                  <p className="text-gray-400 line-through text-lg">
                    ₹{product.salePrice}
                  </p>
                )}
              </div>

              {/* Discount */}
              <div>
                {product.salePrice > product.mainPrice && (
                  <span className="text-xs text-green-600 font-medium">
                    {Math.round(
                      ((product.salePrice - product.mainPrice) /
                        product.mainPrice) *
                        100
                    )}
                    % off
                  </span>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center border rounded-md w-fit select-none">
                  <button
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    className={`px-3 py-1 text-lg font-semibold ${
                      quantity <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    -
                  </button>

                  <span className="px-4 font-semibold text-gray-700">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQty}
                    disabled={quantity >= product.stock}
                    className={`px-3 py-1 text-lg font-semibold ${
                      quantity >= product.stock
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center rounded-md bg-green-500 py-2 px-8 text-white font-semibold shadow-sm transition-all duration-200 hover:bg-green-600 disabled:bg-gray-400"
                >
                  <FaShoppingCart className="mr-2 h-4 w-4" />
                  Add to cart
                </button>
              </div>

              {/* Product Details Section */}
              <div className="mt-8 border-t border-gray-100 pt-5 text-sm text-gray-700">
                <div className="divide-y divide-gray-100">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-800">
                      Product Id:
                    </span>
                    <span className="text-gray-600">
                      {product._id || "FBB00255"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-800">
                      Availability:
                    </span>
                    <span
                      className={`font-medium ${
                        product.stock > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-800">
                      Category:
                    </span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="font-semibold text-gray-800">
                      Delivery Date:
                    </span>
                    <span className="text-gray-600">
                      Updated on order page soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-0 sm:p-10">
            <div className="mt-4">
              <div className="pt-12">
                <div className="flex justify-center items-start w-full">
                  <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 ">
                    Description
                  </p>
                </div>
                <div className="mx-4 rounded my-8">
                  <p className="w-full flex justify-start items-start whitespace-pre-line break-words flex-col bg-gray-50 p-8">
                    {product.description}
                  </p>
                </div>

                <div className="px-3 select-none">
                  <div className="flex flex-col md:flex-row md:flex-wrap gap-3 justify-center">
                    {product.photo.slice(0, 5).map((photo, index) => (
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-full md:w-72 md:h-72 rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white group"
                      >
                        {/* Image with zoom effect */}
                        <img
                          src={`${import.meta.env.VITE_SERVER}/${photo}`}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-125"
                          draggable="false"
                        />

                        {/* Optional overlay when hovering */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <>
                <div className="pt-16 px-4 md:px-6 2xl:px-0 2xl:container 2xl:mx-auto flex justify-center items-center">
                  <div className="flex flex-col justify-start items-start w-full space-y-3">
                    {/* Reviews Header */}
                    <div className="w-full flex justify-center items-start">
                      <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
                        Reviews
                      </p>
                    </div>

                    {/* Static Overall Rating */}
                    <div className="w-full bg-beige-50 rounded-xl p-6 shadow-md flex flex-col items-center space-y-4">
                      Overall Rating:
                      <div className="flex items-center space-x-2">
                        {ratings > 1 && (
                          <span className="text-sm py-2 uppercase">
                            <StarRating rating={ratings} />
                          </span>
                        )}
                        <span className="ml-2 text-gray-700 font-medium">
                          {(averageRating ?? 0).toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="w-full mt-4 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingCount[star.toString()] ?? 0;
                          const percentage =
                            numOfReviews > 0 ? (count / numOfReviews) * 100 : 0;

                          return (
                            <div
                              key={star}
                              className="flex items-center space-x-3"
                            >
                              <span className="w-12 text-gray-700 text-sm">
                                {star} Stars
                              </span>

                              <div className="flex-1 h-3 bg-gray-300 rounded overflow-hidden">
                                <div
                                  className="h-3 bg-yellow-400"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>

                              <span className="w-20 text-gray-700 text-sm text-right">
                                {count}
                                {count === 1 ? "person" : "people"} (
                                {percentage.toFixed(1)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-center w-full">
                        <span className="text-gray-700 font-medium">
                          NUMBER OF REVIEWS: {numOfReviews}
                        </span>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 mb-6"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm"
                              src={
                                review.avatar === "A1"
                                  ? A1
                                  : review.avatar === "A2"
                                  ? A2
                                  : review.avatar === "A3"
                                  ? A3
                                  : review.avatar === "A4"
                                  ? A4
                                  : userPNG
                              }
                              alt={review.name}
                            />

                            <div>
                              <h3 className="text-sm md:text-xl font-semibold text-gray-800">
                                {review.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {review.city}
                              </p>
                            </div>
                          </div>

                          {/* Right: Rating */}
                          <div className="mt-1">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="mt-5 text-gray-700 leading-relaxed text-base border-l-4 border-indigo-400 pl-4">
                          “{review.comment}”
                        </p>

                        {/* Footer: Date */}
                        <div className="pt-4 text-right">
                          <span className="text-sm text-gray-500">
                            {new Date(review.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            •{" "}
                            {new Date(review.updatedAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Total Reviews */}
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </section>

      {product?.category && <RelatedProduct category={product.category} />}
    </div>
  );
};

export default ProductCard;
