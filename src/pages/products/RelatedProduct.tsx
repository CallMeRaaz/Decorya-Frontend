import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/loader";
import { useSearchProductsQuery } from "../../redux/api/productApi";
import { addToCart } from "../../redux/reducer/cartReducer";
import { CustomError } from "../../types/api-types";
import { CartItem } from "../../types/types";
import { useToast } from "../../components/context/toastprovider";

interface RelatedProductProps {
  category: string;
}

const RelatedProduct = ({ category }: RelatedProductProps) => {
  const [page] = useState(1);
  const [search] = useState("");
  const [sort] = useState("");
  const [maxPrice] = useState(100000);
  const { showToast } = useToast();
  const dispatch = useDispatch();

const {
  isLoading: productLoading,
  data: searchedData,
  isError: productIsError,
  error: productError,
} = useSearchProductsQuery(
  {
    search,
    sort,
    category,
    subCategory: "",
    page,
    mainPrice: maxPrice,
  },
  { skip: !category }
);


  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return showToast("Out of Stock", "info");
    dispatch(addToCart(cartItem));
    showToast("Added to cart", "success");
  };

  // Handle error toast
  useEffect(() => {
    if (productIsError && productError) {
      const err = productError as CustomError;
      showToast(
        err?.data?.message || "Failed to load related products",
        "error"
      );
    }
  }, [productIsError, productError]);

  return (
    <div className="bg-white py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Related Products
        </h2>

        {productLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchedData?.products && searchedData.products.length > 0 ? (
              searchedData.products.map((i) => (
                <ProductCard
                  key={i._id}
                  _id={i._id}
                  name={i.name}
                  mainPrice={i.mainPrice}
                  salePrice={i.salePrice}
                  stock={i.stock}
                  rating={i.ratings}
                  handler={addToCartHandler}
                  photo={`${import.meta.env.VITE_SERVER}/${i.photo[0]}`}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No related products found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
