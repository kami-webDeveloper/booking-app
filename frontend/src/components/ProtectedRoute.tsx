import { Navigate, useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoadingValidation } = useAppContext();
  const location = useLocation();

  if (isLoadingValidation) return null;

  if (!isLoggedIn) {
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
