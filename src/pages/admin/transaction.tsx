import { Key, ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useAllOrdersQuery,
  useDeleteOrderMutation,
} from "../../redux/api/orderAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import Loader from "../../components/loader";
import Model from "../../components/admin/Model";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useToast } from "../../components/context/toastprovider";

interface OrderDataType {
  key: Key | null | undefined;
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  updatedAt: string;
  detailsAction: ReactElement;
  deleteAction: ReactElement;
}

const Orders = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);
  const [rows, setRows] = useState<OrderDataType[]>([]);
  const [filteredRows, setFilteredRows] = useState<OrderDataType[]>([]);
  const [deleteOrder] = useDeleteOrderMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("All"); // Default: show all

  const deleteHandler = async (orderId: string) => {
    try {
      const res = await deleteOrder({ userId: user?._id!, orderId });

      if ("data" in res && res.data) {
        showToast("Order deleted successfully", "success");
      } else {
        const errorMsg =
          "error" in res && res.error
            ? "error" in res.error
              ? res.error.error
              : "Failed to delete order"
            : "Failed to delete order";
        showToast(errorMsg, "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      showToast(err?.data?.message || "An unknown error occurred", "error");
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      const newRows = data.orders
        .map((order) => ({
          key: order._id,
          orderId: order._id,
          customerName: order.user ? order.user.name : "Unknown",
          amount: order.total || 0,
          status: order.status || "Confirmed",
          updatedAt: order.updatedAt || new Date().toISOString(),
          detailsAction: (
            <Link to={`/admin/order/${order._id}`} className="text-blue-600">
              View
            </Link>
          ),
          deleteAction: (
            <button
              onClick={() => deleteHandler(order._id)}
              className="text-red-600"
            >
              <FaTrash />
            </button>
          ),
        }))
        // Default: latest first
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

      setRows(newRows);
      setFilteredRows(newRows);
    }
  }, [data]);

  // Filter by status
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((row) => row.status === status));
    }
    setCurrentPage(1);
  };

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredRows.length / itemsPerPage))
      setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <Model />
      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="min-h-screen bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
            <div className="relative pb-10">
              {/* Status Filter Buttons */}

              <div className="relative inline-block text-left mb-4">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex justify-between items-center w-48 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  {statusFilter}
                  {isDropdownOpen ? (
                    <FaChevronUp className="ml-2" />
                  ) : (
                    <FaChevronDown className="ml-2" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute mt-1 w-48 bg-white border rounded-md shadow-lg z-50">
                    {[
                      "All",
                      "Confirmed",
                      "Shipped",
                      "Out for Delivery",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          handleStatusFilter(status);
                          setIsDropdownOpen(false); // Close dropdown on select
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white ${
                          statusFilter === status
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Updated At</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Details</th>
                      <th className="px-6 py-4 text-center">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((order, index) => (
                        <tr
                          key={order.key}
                          className={`border-b transition hover:bg-gray-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            #{order.orderId.slice(-6)}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-800">
                            {order.customerName}
                          </td>

                          <td className="px-6 py-4 font-semibold text-green-600">
                            ₹{order.amount}
                          </td>

                          <td className="px-6 py-4 text-gray-500">
                            {new Date(order.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "Confirmed"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Shipped"
                                    ? "bg-purple-100 text-purple-700"
                                    : order.status === "Out for Delivery"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            {order.detailsAction}
                          </td>

                          <td className="px-6 py-4 text-center">
                            {order.deleteAction}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center mt-4 sm:mb-10">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-5 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                {/* <span className="text-gray-700">
                Page {currentPage} of{" "}
                {Math.ceil(filteredRows.length / itemsPerPage)}
              </span> */}
                <span className="text-gray-700">
                  Page {currentPage} of{" "}
                  {Math.max(1, Math.ceil(filteredRows.length / itemsPerPage))}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage >= Math.ceil(filteredRows.length / itemsPerPage)
                  }
                  className="px-4 py-2 mx-5 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
