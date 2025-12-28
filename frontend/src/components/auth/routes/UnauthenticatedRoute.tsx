import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
}

/**
 * UnauthenticatedRoute component
 * Wraps routes that should only be accessible when NOT authenticated (login, register)
 * Redirects to tasks page if user is already authenticated
 *
 * @param children - Child components to render if not authenticated
 */
export default function UnauthenticatedRoute({
  children,
}: UnauthenticatedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // If authenticated, redirect to tasks
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Not authenticated, show the page (login/register)
  return <>{children}</>;
}
