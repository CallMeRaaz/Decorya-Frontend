import { ReactElement, useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaPlus,
  FaRegBell,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Model from "../../components/admin/Model";
import Loader from "../../components/loader";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { useToast } from "../../components/context/toastprovider";
import { BsSearch } from "react-icons/bs";

interface DataType {
  _id: string;
  photo: ReactElement;
  name: string;
  updatedAt: string;
  mainPrice: number;
  stock: number;
  action: ReactElement;
}

const Products = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading, isError, error, data } = useAllProductsQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  if (isError) {
    const err = error as CustomError;
    showToast(err.data.message, "error");
  }

  useEffect(() => {
    if (data) {
      const mappedRows = data.products.map((i) => {
        return {
          _id: i._id,
          photo: (
            <img
              src={`${import.meta.env.VITE_SERVER}/${i.photo[0]}`}
              alt={i.name}
              className="w-12 h-12 object-cover rounded"
            />
          ),
          name: i.name,
          mainPrice: i.mainPrice,
          stock: i.stock,
          updatedAt: i.updatedAt,
          action: (
            <Link to={`/admin/product/${i._id}`}>
              <button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l font-medium rounded-lg text-sm px-4 py-2">
                Edit
              </button>
            </Link>
          ),
        };
      });

      setRows(mappedRows);
    }
  }, [data]);

  // Sorting function
  const handleSort = (key: keyof DataType) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const filteredRows = rows
    .filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row._id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      let aValue = a[sortConfig.key as keyof DataType];
      let bValue = b[sortConfig.key as keyof DataType];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="h-auto">
      <Model />
      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="min-h-screen bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
              <div className="flex items-center justify-between w-full  bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2">
                <div className="flex items-center w-full space-x-3 text-gray-500">
                  <BsSearch className="text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for Id or name"
                    className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                  />
                </div>
                <Link to="/admin/product/new">
                  <button className="relative p-2 rounded-full bg-gray-50 hover:bg-gray-300 transition">
                    <FaPlus className="text-gray-600 text-lg" />
                  </button>
                </Link>
              </div>
              <div className="flex items-center text-sm py-3">
                <button
                  onClick={() => handleSort("mainPrice")}
                  className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-700">Price</span>
                  {sortConfig.key === "mainPrice" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortAmountUp className="text-blue-600" />
                    ) : (
                      <FaSortAmountDown className="text-blue-600" />
                    ))}
                </button>

                <button
                  onClick={() => handleSort("stock")}
                  className="flex items-center gap-2 px-3 mx-2 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-700">Stock</span>
                  {sortConfig.key === "stock" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortAmountUp className="text-green-600" />
                    ) : (
                      <FaSortAmountDown className="text-green-600" />
                    ))}
                </button>
              </div>
              {/* <div className="flex gap-2">
                <button
                  onClick={() => handleSort("mainPrice")}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Price
                  {sortConfig.key === "mainPrice" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortAmountUp />
                    ) : (
                      <FaSortAmountDown />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("stock")}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Stock
                  {sortConfig.key === "stock" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortAmountUp />
                    ) : (
                      <FaSortAmountDown />
                    ))}
                </button>
              </div> */}

              {/* Product Grid */}
              {filteredRows.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Product ID</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-3 py-4">Updated</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.length > 0 ? (
                        filteredRows.map((product, index) => (
                          <tr
                            key={product._id}
                            className={`border-b transition hover:bg-gray-50 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <td className="px-6 rounded-full py-4">
                              <div className="w-14 h-14">{product.photo}</div>
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-900">
                              {product.name}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              #{product._id.slice(-6)}
                            </td>

                            <td className="px-6 py-4 font-semibold text-green-600">
                              ₹{product.mainPrice}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  product.stock > 10
                                    ? "bg-green-100 text-green-700"
                                    : product.stock > 0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </td>

                            <td className=" py-4 text-gray-500">
                              {new Date(product.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>

                            <td className="px-6 py-4 text-center">
                              {product.action}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-8 text-center text-gray-500"
                          >
                            No Products Found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center !p-0 my-24 bg-white rounded-lg">
                  <FaBoxOpen className="text-gray-300 text-6xl mb-4 animate-pulse" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Products Found
                  </h2>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    We couldn’t find any products matching your search or
                    filter.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
