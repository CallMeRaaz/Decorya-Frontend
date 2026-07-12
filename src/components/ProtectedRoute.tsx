
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import NotFound from "../components/notFound"; 

interface ProtectedRouteProps {
  isAdminRoute?: boolean;       // Only admin access
  restrictedToGuest?: boolean;  // Only guest (login/register)
  isVerified?: boolean;         // Only verified users
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAdminRoute = false,
  isVerified = false,
  restrictedToGuest = false,
  children,
}) => {
  const { user, } = useSelector((state: RootState) => state.user);


  // if (loading) return <div>Loading...</div>;

  // Guest only
  if (restrictedToGuest && user) return <Navigate to="/profile" replace />;

  // Requires login
  if (!user && !restrictedToGuest) return <Navigate to="/login" replace />;

  // Requires verified user
  if (isVerified && !user?.isVerified) return <Navigate to="/verify" replace />;

  // Admin only
  if (isAdminRoute && user?.role !== "admin") return <NotFound />;

  return children;
};


export default ProtectedRoute;
