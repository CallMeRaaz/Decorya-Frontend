import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import Breadcrumbs from "../../components/breadcrumbs";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useToast } from "../../components/context/toastprovider";

interface Product {
  _id: string;
  name: string;
  photo: string[];
  mainPrice: number;
  stock: number;
  ratings: number;
}

const breadcrumbData = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Wishlist", href: `/wishlist` },
];

const Wishlist: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productPromises = wishlist.map((id: string) =>
          axios.get(`${import.meta.env.VITE_SERVER}/api/v1/product/${id}`)
        );
        const productResponses = await Promise.all(productPromises);
        const products = productResponses.map((res) => res.data.product);
        setWishlistProducts(products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const handleWishlistToggle = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(productId)) {
      const updatedWishlist = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      setWishlistProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } else {
      wishlist.push(productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/v1/product/${productId}`
          );
          setWishlistProducts((prev) => [...prev, response.data.product]);
          showToast("Added to Wishlist!", "success");
        } catch (err: any) {
          showToast("Error adding to wishlist!", "error");
        }
      };

      fetchProduct();
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (wishlistProducts.length === 0) {
    return (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbData} />
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 px-6">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-full max-w-md">
            <FaHeart className="text-rose-300 text-6xl mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6">
              You haven’t added any products to your wishlist yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-600 transition-transform transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbData} />

      <div className="mx-auto mb-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
          {wishlistProducts.map((product) => (
            <div className="relative" key={product._id}>
              <FaHeart
                className="absolute w-4 top-2 right-2 z-[1] text-rose-500 cursor-pointer"
                onClick={() => handleWishlistToggle(product._id)}
              />
              <ProductCard
                _id={product._id}
                name={product.name}
                photo={`${import.meta.env.VITE_SERVER}/${product.photo[0]}`}
                mainPrice={product.mainPrice}
                stock={product.stock}
                rating={product.ratings}
                handler={() => {}}
                salePrice={0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
