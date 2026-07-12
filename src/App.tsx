import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/loader";
import ProtectedRoute from "./components/ProtectedRoute";
import Test from "./components/test.tsx";

import Navbar from "./components/Navbar";

import Footer from "./components/footer";
import Profile from "./pages/user/profile";
import SavedAddress from "./pages/user/SavedAddress.tsx";
import Wishlist from "./pages/products/wishlist.tsx";
import Shipping from "./pages/payment/shipping";
import Signup from "./pages/user/signup";
import Order from "./pages/user/order.tsx";
import OrderDetails from "./pages/user/orderDetails";
import Invoice from "./pages/user/Invoice.tsx";
import Confirmation from "./pages/payment/confirmation";
import ForgotPassword from "./pages/user/forgot-password";
import ResetPassword from "./pages/user/reset-password.tsx";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import NotFound from "./components/notFound";
import EditDeleteBanner from "./pages/admin/EditDeleteBanner.tsx";
import ScrollToTop from "./components/scrollTop.tsx";
import ContactUs from "./pages/other/contactus.tsx";
import AboutUs from "./pages/other/aboutUs";
import Notifications from "./pages/other/Notifications";
import { ToastProvider } from "./components/context/toastprovider.tsx";
import PrivacyPolicy from "./components/context/p&p.tsx";
import TermsAndConditions from "./components/context/t&c.tsx";
import ScrollTopButton from "./components/scrolltoparrow.tsx";

// Lazy-loaded components
const Home = lazy(() => import("./pages/other/home.tsx"));
const AllProducts = lazy(() => import("./pages/products/AllProducts.tsx"));
const Signin = lazy(() => import("./pages/user/signin"));
const Search = lazy(() => import("./pages/products/search.tsx"));
const Cart = lazy(() => import("./pages/other/Carts"));

const Payment = lazy(() => import("./pages/payment/paymentOption"));
const ProductCard = lazy(() => import("./pages/products/Product-Detail.tsx"));

//Admin routs
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const AdimnNotification = lazy(() => import("./pages/admin/notification"));
const Products = lazy(() => import("./pages/admin/products"));
const AdminContact = lazy(() => import("./pages/admin/contactus"));
const Customers = lazy(() => import("./pages/admin/customers"));
const EditCustomer = lazy(() => import("./pages/admin/EditCustomerRole.tsx"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const AdminBanner = lazy(() => import("./pages/admin/AdminBanner"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ContactUsmanagement = lazy(
  () => import("./pages/admin/management/contactUsmanagement"),
);

const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement"),
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement"),
);

const App = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Router>
      <ToastProvider>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;1,600&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: "* { font-family: 'Source Sans Pro'; }",
          }}
        />

        <Navbar user={user} />
        <Suspense fallback={<Loader />}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/test" element={<Test />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />

            <Route
              path="/product/:id"
              element={
                <ProductCard
                  _id={""}
                  name={""}
                  photo={""}
                  mainPrice={0}
                  stock={0}
                  handler={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />

            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute restrictedToGuest={true}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute restrictedToGuest={true}>
                  <Signin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <ProtectedRoute restrictedToGuest={true}>
                  <Signup />
                </ProtectedRoute>
              }
            />

            {/* Protected routes for logged-in users */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-address"
              element={
                <ProtectedRoute>
                  <SavedAddress />
                </ProtectedRoute>
              }
            />
            <Route path="/wishlist" element={<Wishlist />} />

            <Route
              path="/shipping"
              element={
                <ProtectedRoute>
                  <Shipping />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice/:id"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />

            <Route
              path="/confirmation"
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              }
            />

            {/*admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/product"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/contact"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <AdminContact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contact/:email"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <ContactUsmanagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customer"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transaction"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/order/:id"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <TransactionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/banner"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <AdminBanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-banner/:id"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <EditDeleteBanner />
                </ProtectedRoute>
              }
            />
            {/* Charts */}
            {/* <Route
            path="/admin/chart/bar"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <Barcharts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chart/pie"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <Piecharts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chart/line"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <Linecharts />
              </ProtectedRoute>
            }
          /> */}
            {/* Apps */}
            <Route
              path="/admin/app/coupon"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <Coupon />
                </ProtectedRoute>
              }
            />

            {/* Management */}
            <Route
              path="/admin/product/new"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <NewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notification"
              element={
                <ProtectedRoute isAdminRoute={true}>
                  <AdimnNotification />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ScrollTopButton />
        <Footer />
      </ToastProvider>
    </Router>
  );
};

export default App;
