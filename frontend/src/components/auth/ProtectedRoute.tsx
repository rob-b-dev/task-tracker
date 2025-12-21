import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 * Redirects to login page if user is not authenticated
 * Shows toast notification only when user directly accesses protected route (not after login/register)
 *
 * @param children - Child components to render if authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasShownToast = useRef(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    // Check if user is coming from a logout action
    const isFromLogout = location.state?.fromLogout === true;
    const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

    // Clear the logout flag if it exists
    if (justLoggedOut) {
      sessionStorage.removeItem("justLoggedOut");
    }

    // Only show toast notification if:
    // 1. Authentication check is complete (not loading)
    // 2. User is not authenticated
    // 3. Toast hasn't been shown yet (prevents duplicates)
    // 4. User didn't just come from login or register pages
    // 5. User is not logging out (prevents duplicate toast with logout success message)
    if (
      !isLoading &&
      !isAuthenticated &&
      !hasShownToast.current &&
      !isFromLogout &&
      !justLoggedOut &&
      previousPath.current !== "/login" &&
      previousPath.current !== "/register"
    ) {
      toast.info("Please login to view tasks", { toastId: "protected-route" });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isLoading, location.state]);

  // Show nothing while checking authentication status
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
