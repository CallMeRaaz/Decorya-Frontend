import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Model from "../../components/admin/Model";
import { BarChart } from "../../components/admin/Charts";
// import Table from "../../components/admin/DashboardTable";
import { RootState } from "../../redux/store";
import { getLastMonths } from "../../utils/features";
import { useStatsQuery } from "../../redux/api/dashboardApi";
import Loader from "../../components/loader";
import { FaBox, FaShoppingBag, FaUsers, FaRupeeSign } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { useAllUsersQuery } from "../../redux/api/userAPI";

const { last6Months: months } = getLastMonths();

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: productsData } = useAllProductsQuery(user?._id!);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useAllOrdersQuery(user?._id!);

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useAllUsersQuery(user?._id!);

  const totalCustomers = usersData?.users?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;
  const totalProducts = productsData?.products?.length || 0;

  const totalRevenue =
    ordersData?.orders?.reduce((acc, order) => {
      if (order.status === "Delivered") {
        return acc + (order.total || 0);
      }
      return acc;
    }, 0) || 0;

  const { isLoading, data, isError } = useStatsQuery(user?._id!);

  if (isError) return <Navigate to="/" />;

  const stats = data?.stats || {
    count: { revenue: 0, user: 0, order: 0, product: 0 },
    changePercent: { revenue: 0, user: 0, order: 0, product: 0 },
    chart: { revenue: [], order: [] },
    categoryCount: [],
  };

  const recentPendingOrders =
    ordersData?.orders
      ?.filter(
        (order) =>
          order.status !== "Delivered" &&
          order.status !== "Shipped" &&
          order.status !== "Cancelled",
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 20) || [];



      const confirmedOrders =
  ordersData?.orders?.filter(
    (order) => order.status === "Confirmed"
  ).length || 0;

const shippedOrders =
  ordersData?.orders?.filter(
    (order) => order.status === "Shipped"
  ).length || 0;

const outForDeliveryOrders =
  ordersData?.orders?.filter(
    (order) => order.status === "Out for Delivery"
  ).length || 0;

const deliveredOrders =
  ordersData?.orders?.filter(
    (order) => order.status === "Delivered"
  ).length || 0;

const cancelledOrders =
  ordersData?.orders?.filter(
    (order) => order.status === "Cancelled"
  ).length || 0;

  return (
    <>
      <Model />
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className=" bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
            <div className="flex items-center justify-between w-full  bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2 mb-8">
              <div className="flex items-center w-full space-x-3 text-gray-500">
                <BsSearch className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search for data, users, docs..."
                  className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <Link to="/admin/notification">
                <FaRegBell className="text-gray-600 text-lg" />
                </Link>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link
                to="/admin/product"
                className="bg-green-100 rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex  items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Products</p>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {totalProducts}
                    </h2>
                  </div>
                  <div className="p-3 bg-green-300 rounded-lg">
                    <FaBox className="text-green-600 text-xl" />
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/transaction"
                className="bg-blue-100 rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Orders</p>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {totalOrders}
                    </h2>
                  </div>
                  <div className="p-3 bg-blue-300 rounded-lg">
                    <FaShoppingBag className="text-blue-600 text-xl" />
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/customer"
                className="bg-purple-100 rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Customers</p>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {totalCustomers}
                    </h2>
                  </div>
                  <div className="p-3 bg-purple-300 rounded-lg">
                    <FaUsers className="text-purple-600 text-xl" />
                  </div>
                </div>
              </Link>

              <Link
                to=""
                className="bg-yellow-100 rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      ---
                    </h2>
                  </div>
                  <div className="p-3 bg-yellow-300 rounded-lg">
                    <FaRupeeSign className="text-yellow-600 text-xl" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h3>

                <button className="text-sm text-green-600 hover:underline">
                  <Link to="/admin/transaction"> View all</Link>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full sm:w-1/2 text-sm text-left text-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Customer
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Order ID
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Date
                    </th>
                  </tr>
                  <tbody>
                    {recentPendingOrders.length > 0 ? (
                      recentPendingOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3">
                            <Link to={`/admin/order/${order._id}`}>
                              <span
                                className={`px-3 py-2 rounded-full text-xs font-semibold ${
                                  order.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-600"
                                    : order.status === "Shipped"
                                      ? "bg-purple-100 text-purple-600"
                                      : order.status === "Out for Delivery"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {order.status}
                              </span>
                            </Link>
                          </td>

                          <td className="px-4 py-3">
                            {order.user?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-3 font-medium">{order._id}</td>
                          <td className="px-4 py-3">₹{order.total || 0}</td>
                          <td className="px-4 py-3">
                            {new Date(order.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No pending orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

<div className="bg-gray-50 flex flex-col sm:ml-16 pt-8 px-5">
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
  <div className="bg-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-blue-600 font-medium">
      Confirmed
    </p>
    <h3 className="text-3xl font-bold text-blue-700 mt-2">
      {confirmedOrders}
    </h3>
  </div>

  <div className="bg-purple-100 border border-purple-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-purple-600 font-medium">
      Shipped
    </p>
    <h3 className="text-3xl font-bold text-purple-700 mt-2">
      {shippedOrders}
    </h3>
  </div>

  <div className="bg-yellow-100 border border-yellow-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-yellow-700 font-medium">
      Out for Delivery
    </p>
    <h3 className="text-3xl font-bold text-yellow-700 mt-2">
      {outForDeliveryOrders}
    </h3>
  </div>

  <div className="bg-green-100 border border-green-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-green-600 font-medium">
      Delivered
    </p>
    <h3 className="text-3xl font-bold text-green-700 mt-2">
      {deliveredOrders}
    </h3>
  </div>

  <div className="bg-red-100 border border-red-200 rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-red-600 font-medium">
      Cancelled
    </p>
    <h3 className="text-3xl font-bold text-red-700 mt-2">
      {cancelledOrders}
    </h3>
  </div>
</section></div>

          <main className="bg-gray-50 flex flex-col sm:ml-16 pt-8 pb-8 px-5">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <WidgetItem
                percent={stats.changePercent.revenue}
                amount={true}
                value={totalRevenue}
                heading="Revenue"
                color="rgb(0, 115, 255)"
              />
              <WidgetItem
                percent={stats.changePercent.user}
                value={stats.count.user}
                color="rgb(0 198 202)"
                heading="Users"
              />
              <WidgetItem
                percent={stats.changePercent.order}
                value={stats.count.order}
                color="rgb(255 196 0)"
                heading="Transactions"
              />

              <WidgetItem
                percent={stats.changePercent.product}
                value={stats.count.product}
                color="rgb(76 0 255)"
                heading="Products"
              />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Revenue & Transactions
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Last 6 months performance overview
                  </p>
                </div>
                <BarChart
                  labels={months}
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 115, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)"
                />
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Inventory</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Product categories distribution
                  </p>
                </div>
                <div>
                  {stats.categoryCount.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        value={value}
                        heading={heading}
                        color={`hsl(${value * 4}, ${value}%, 50%)`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => {
  const safePercent = Number.isFinite(percent) ? percent : 0;

  const displayPercent = Math.max(-9999, Math.min(9999, safePercent));

  const circlePercent = Math.max(0, Math.min(100, Math.abs(safePercent)));

  return (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-gray-500 text-sm">{heading}</p>

        <h4 className="text-2xl font-bold text-gray-800 mt-2">
          {amount ? `₹${Number(value).toLocaleString("en-IN")}` : value}
        </h4>

        <div
          className={`flex items-center gap-1 mt-3 text-sm font-medium ${
            safePercent >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {safePercent >= 0 ? <HiTrendingUp /> : <HiTrendingDown />}

          <span>
            {safePercent >= 0 ? "+" : ""}
            {displayPercent}%
          </span>
        </div>
      </div>

      <div
        className="h-16 w-16 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(
            ${color} ${(circlePercent / 100) * 360}deg,
            #f3f4f6 0deg
          )`,
        }}
      >
        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-semibold" style={{ color }}>
            {displayPercent}%
          </span>
        </div>
      </div>
    </article>
  );
};

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-medium text-gray-700">{heading}</h5>

        <span className="text-sm font-semibold text-gray-500">
          {safeValue}%
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            backgroundColor: color,
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
