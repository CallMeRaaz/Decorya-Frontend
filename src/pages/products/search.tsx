import { useState } from "react";
import cross from "../../assets/frontend_assets/x.png";
import searchicon from "../../assets/frontend_assets/search_icon.png";
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
import { FaBoxOpen, FaSearch } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";

const Search = () => {
  const searchQuery = useSearchParams()[0];

  const { isError, error } = useCategoriesQuery("");

  const [, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [subCategory, setSubCategory] = useState(
    searchQuery.get("subCategory") || ""
  );
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
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
    page,
    mainPrice: maxPrice,
  });

  const dispatch = useDispatch();
  const toggleFilter = () => setIsOpen(!isOpen);
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return showToast("Out of Stock", "info");
    dispatch(addToCart(cartItem));
    showToast("Added to cart", "success");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    const err = error as CustomError;
    showToast(err.data.message, "error");
  }
  if (productIsError) {
    const err = productError as CustomError;
    showToast(err.data.message, "error");
  }
  const clearAll = () => {
    setCategory("");
    setSubCategory("");
    setPriceRange([0, 10000]);
    setSort("");
    setMaxPrice(10000);
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

  const clearInput = () => {
    setSearch("");
  };

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

        <main className="mx-auto sm:px-6 lg:px-8">
          <div className="flex items-baseline  justify-between border-b border-gray-200 pb-4 pt-20">
            <div className="flex items-center  justify-between w-full pr-7">
              <Menu
                as="div"
                className="relative w-2/3 sm:w-1/2 inline-block text-left "
              >
                <div>
                  <div className=" mx-auto rounded-lg overflow-hidden">
                    <div className="md:flex justify-end">
                      <div className="w-full p-3">
                        <div className="relative">
                          <img
                            src={searchicon}
                            className="absolute w-4 text-gray-400 top-3 left-4"
                            alt=""
                          />
                          <input
                            type="text"
                            className="bg-white border h-10 w-full px-12 rounded-lg focus:outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search here..."
                          />
                          <span className="absolute top-0.5 right-1.5 border-l pl-2.5">
                            <img
                              src={cross}
                              className="w-9 p-1 cursor-pointer"
                              alt="Clear"
                              onClick={clearInput}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </div>
              </Menu>
              <span className="flex">
                <Menu as="div" className="relative inline-block text-left">
                  <div className="">
                    <MenuButton
                      className={`flex items-center justify-between w-full text-sm font-medium text-gray-700 p-2  rounded-md ${
                        sort === "asc" || sort === "dsc"
                          ? "bg-green-100"
                          : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <img src={sorticon} className="w-6" alt="" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <button
                          onClick={() => setSort("")}
                          className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            sort === "" ? "bg-green-100" : ""
                          }`}
                        >
                          None
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => setSort("asc")}
                          className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            sort === "asc" ? "bg-green-100" : ""
                          }`}
                        >
                          Price (Low to High)
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => setSort("dsc")}
                          className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            sort === "dsc" ? "bg-green-100" : ""
                          }`}
                        >
                          Price (High to Low)
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>

                <button
                  type="button"
                  onClick={toggleFilter}
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Filters</span>
                  <img src={filtericon} className="w-6 cursor-pointer" alt="" />
                </button>
              </span>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Product grid */}
              {productLoading ? (
                <Loader />
              ) : (
                <div className="lg:col-span-4">
                  <section className="bg-white text-gray-700">
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                      {search ? (
                        searchedData?.products &&
                        searchedData.products.length > 0 ? (
                          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
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
                                photo={`${import.meta.env.VITE_SERVER}/${
                                  i.photo[0]
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          // ✅ Full-width, centered "No Products Found"
                          <div className="flex flex-col items-center justify-center !p-0 my-24 bg-white rounded-lg">
                            <FaBoxOpen className="text-gray-300 text-6xl mb-4 animate-pulse" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                              No Products Found
                            </h2>
                            <p className="text-gray-500 mb-6 text-center max-w-md">
                              We couldn’t find any products matching your search
                              or filter. Try browsing all products.
                            </p>
                            <Link
                              to="/products"
                              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-600 transition-transform transform hover:scale-105"
                            >
                              Browse All Products
                            </Link>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center !p-0 my-24 bg-white rounded-lg">
                          <div className="bg-white p-8 text-center w-full max-w-md">
                            <div className="flex items-center justify-center gap-3 mb-4">
                              <FaSearch className="text-gray-400 text-5xl animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                              Start Searching
                            </h2>
                            <p className="text-gray-500 mb-6">
                              Type a product name or keyword above to explore
                              our collection.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm italic">
                              <span>Start typing to search...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </section>

          <div className="w-full flex justify-center">
            {searchedData && searchedData.totalPage > 1 && (
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-10 text-base">
                  <li>
                    <button
                      disabled={!isPrevPage}
                      onClick={() => setPage((prev) => prev - 1)}
                      className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg ${
                        !isPrevPage
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-3 h-3 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 1 1 5l4 4"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from(
                    { length: searchedData.totalPage },
                    (_, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setPage(index + 1)}
                          className={`flex items-center justify-center px-4 h-10 leading-tight ${
                            page === index + 1
                              ? "z-10 text-blue-600 border border-blue-300 bg-blue-50"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li>
                    <button
                      disabled={!isNextPage}
                      onClick={() => setPage((prev) => prev + 1)}
                      className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg ${
                        !isNextPage
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-3 h-3 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
                <article className="mt-4 text-center">
                  <button
                    disabled={!isPrevPage}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`mr-2 ${
                      !isPrevPage ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Prev
                  </button>
                  <span>
                    {page} of {searchedData.totalPage}
                  </span>
                  <button
                    disabled={!isNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`ml-2 ${
                      !isNextPage ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Next
                  </button>
                </article>
              </nav>
            )}
          </div>
        </main>
      </div>
    </>
  );
};
export default Search;
