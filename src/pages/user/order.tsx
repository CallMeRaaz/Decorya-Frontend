import { Link } from "react-router-dom";
import cross from "../../assets/frontend_assets/x.png";
import search from "../../assets/frontend_assets/search_icon.png";
import { useState, useEffect, Key } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import { FaClipboardList } from "react-icons/fa";

interface Order {
  status: string;
  orderItems: any;
  _id: string;
  createdAt: string;
  total: number;
}

const Order = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [inputValue, setInputValue] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    filterOrders(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
    setFilteredOrders(orders); // Reset to show all orders
  };

  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/orders" },
  ];

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/v1/order/my?id=${user?._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      const sortedOrders = data.orders.sort((a: Order, b: Order) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders); // Initialize with all orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter orders based on ID, date, or total
  const filterOrders = (searchTerm: string) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = orders.filter((order) => {
      // Format the date to "DD MMM YYYY"
      const formattedDate = new Date(order.createdAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

      return (
        order._id.toLowerCase().includes(lowerSearchTerm) || // Match by Order ID
        formattedDate.toLowerCase().includes(lowerSearchTerm) || // Match by Date (partial match allowed)
        order.total.toString().includes(lowerSearchTerm) // Match by Price
      );
    });

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Breadcrumbs breadcrumbs={breadcrumbData} />
          <div className="">
            <div className="relative my-4 px-5 flex">
              {/* <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none"> */}
              <img
                src={search}
                className="absolute w-4 text-gray-400 top-3 left-8"
                alt="Search Icon"
              />
              {/* </div> */}
              <input
                type="text"
                className="bg-white border h-10 sm:w-1/3 px-10 rounded-lg focus:outline-none"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Order ID, Date, or Total.."
              />
              {/* <span className="absolute top-2 right-4 border-l pl-2.5"> */}
              <img
                src={cross}
                className="w-9 border-r-2 border-gray-400  h-8 cursor-pointer mt-1"
                alt="Clear Search"
                onClick={clearInput}
              />
              {/* </span> */}
            </div>
          </div>

          <div>
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
                {filteredOrders.map((order) => (
                  <Link
                    to={`/order/${order._id}`}
                    key={order._id}
                    className="block  border-gray-200 rounded-xl bg-white shadow-md hover:shadow-xl transform transition hover:-translate-y-1"
                  >
                    <div className="p-5 flex flex-col h-full justify-between">
                      {/* Order Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-800 font-semibold text-sm mb-1">
                            Order ID:{" "}
                            <span className="text-indigo-600">
                              {order._id.slice(0, 8)}...
                            </span>
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            at{" "}
                            {new Date(order.createdAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex -space-x-2 mt-1">
                          {order.orderItems
                            .slice(0, 4)
                            .map(
                              (item: {
                                _id: Key | null | undefined;
                                photo: string;
                                name: string;
                              }) => (
                                <img
                                  key={item._id}
                                  src={`${import.meta.env.VITE_SERVER}/${
                                    item.photo
                                  }`}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                />
                              )
                            )}
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                            order.status === "Confirmed"
                              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                              : order.status === "Shipped"
                              ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                              : order.status === "Out for Delivery"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                              : order.status === "Delivered"
                              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                              : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-green-700 font-bold text-base">
                          ₹ {order.total}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center !p-0 my-24 mb-32 bg-white rounded-lg">
                <div className="bg-white p-8 text-center w-full max-w-md">
                  <div className="flex items-center justify-center mb-4">
                    <FaClipboardList className="text-gray-300 text-6xl animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Orders Found
                  </h2>
                  <p className="text-gray-500 mb-6">
                    You haven’t placed any orders yet. Start shopping and your
                    orders will appear here.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition-transform transform hover:scale-105"
                  >
                    <span>Start Shopping</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
