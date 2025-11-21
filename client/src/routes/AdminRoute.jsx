// client/src/routes/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  // not logged in → send to login
  if (!auth?.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // logged in but not admin → send home (or a 403 page)
  if (auth.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}