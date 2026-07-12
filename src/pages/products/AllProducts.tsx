import { useState } from "react";
import filtericon from "../../assets/frontend_assets/filter.png";
import sorticon from "../../assets/frontend_assets/sort.png";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../../redux/api/productApi";
import { CustomError } from "../../types/api-types";
import { CartItem } from "../../types/types";
import { addToCart } from "../../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/loader";
import { useToast } from "../../components/context/toastprovider";
import { FaBoxOpen } from "react-icons/fa";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // ✅ Local states
  const [search] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [subCategory, setSubCategory] = useState(
    searchParams.get("subCategory") || ""
  );
  const [isOpen, setIsOpen] = useState(false);

  const { isError, error } = useCategoriesQuery("");
  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    subCategory,
    page: 1,
    mainPrice: maxPrice,
  });

  // ✅ Handlers
  const toggleFilter = () => setIsOpen(!isOpen);

  const clearAll = () => {
    setCategory("");
    setSubCategory("");
    setPriceRange([0, 10000]);
    setSort("");
    setMaxPrice(10000);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return showToast("Out of Stock", "error");
    dispatch(addToCart(cartItem));
    showToast("Added to cart", "success");
  };

  // ✅ Handle category & subcategory extraction
  const categories = Array.from(
    new Set(
      searchedData?.products?.map((p) => p.category).filter(Boolean) || []
    )
  );

  const subCategories = Array.from(
    new Set(
      searchedData?.products
        ?.filter((p) => p.category === category && p.subCategory)
        .map((p) => p.subCategory)
        .filter(Boolean)
    )
  );

  // ✅ Error handling
  if (isError) {
    const err = error as CustomError;
    showToast(err.data.message, "error");
  }
  if (productIsError) {
    const err = productError as CustomError;
    showToast(err.data.message, "error");
  }

  return (
    <>
      <div className="bg-white pt-4">
        {/* Sidebar Filter */}
        <div className="relative">
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={toggleFilter}
            ></div>
          )}
          <div
            className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } w-full sm:w-2/3 md:w-1/3 lg:w-1/4`}
          >
            <div className="p-5 overflow-y-auto h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>
              <hr className="mb-8" />

              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-3">Categories</h3>

                  <div className="flex mb-3 justify-between items-center">
                    <button
                      onClick={clearAll}
                      className="bg-gray-100 hover:bg-gray-300 text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        category === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              {subCategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Sub Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSubCategory(sub)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          subCategory === sub
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-800 font-semibold mb-3">
                  Max Price
                </label>

                {/* Slider with value indicator */}
                <div className="relative">
                  <input
                    type="range"
                    min={100}
                    max={10000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-300"
                  />

                  {/* Value Bubble */}
                  <div className="absolute -top-8 left-0 w-full flex justify-center">
                    <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-md">
                      ₹{maxPrice}
                    </div>
                  </div>
                </div>

                {/* Value Range Info */}
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>₹100</span>
                  <span>₹10,000</span>
                </div>
              </div>

              <button
                onClick={toggleFilter}
                className="absolute top-6 right-8 font-semibold text-xl text-gray-500"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <main className="mx-auto sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 pt-20">
            <div className="flex items-center justify-between w-full pr-7">
              <Menu
                as="div"
                className="relative w-2/3 sm:w-1/2 inline-block text-left"
              >
                <div className="md:flex justify-end">
                  <div className="w-full p-3">
                    <span className="flex ml-4 font-semibold text-gray-800">
                      {category && category.trim() !== "" ? (
                        <span className="ml-2 text-gray-500"> {category}</span>
                      ) : (
                        "All Products"
                      )}
                    </span>
                  </div>
                </div>
              </Menu>

              {/* Sort + Filter Buttons */}
              <span className="flex">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center justify-between w-full text-sm font-medium text-gray-700 p-2 bg-white hover:bg-gray-100 rounded-md">
                    <img src={sorticon} className="w-6" alt="" />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {[
                        { label: "None", value: "" },
                        { label: "Price (Low to High)", value: "asc" },
                        { label: "Price (High to Low)", value: "dsc" },
                      ].map((opt) => (
                        <MenuItem key={opt.value}>
                          <button
                            onClick={() => setSort(opt.value)}
                            className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                              sort === opt.value ? "bg-green-100" : ""
                            }`}
                          >
                            {opt.label}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>

                <button
                  type="button"
                  onClick={toggleFilter}
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500"
                >
                  <img src={filtericon} className="w-6 cursor-pointer" alt="" />
                </button>
              </span>
            </div>
          </div>

          {/* Product Display */}
          <section className="pb-24 px-4">
            {productLoading ? (
              <Loader />
            ) : searchedData?.products?.length ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
                {searchedData.products.map((i) => (
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
                ))}
              </div>
            ) : (
              <div className="flex w-full min-h-[40vh] flex-col items-center justify-center my-24">
                <FaBoxOpen className="text-gray-300 text-6xl mb-4 animate-pulse" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  We couldn’t find any products matching your search or filter.
                  Try browsing all products.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-600 transition-transform transform hover:scale-105"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default Search;
