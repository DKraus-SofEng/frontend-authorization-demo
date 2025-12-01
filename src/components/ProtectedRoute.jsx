import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

// "anonymous" prop is used to indicate routes that can be visited anonymously
// (i.e., without authorization). The two 'anonymous' routes in this application
// are /register and /login.
export default function ProtectedRoute({ children, anonymous = false }) {
  const location = useLocation();
  const from = location.state?.from || "/";

  const { isLoggedIn } = useContext(AppContext);

  // If user is logged in, they are redirected away from anonymous routes.
  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }
  // If a user is not logged in and tries to access a route that
  // requires authorization, they are redirected to the /login route.
  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  // Otherwise, display the children of the current route.
  return children;
}
