import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (role && getRole() !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
