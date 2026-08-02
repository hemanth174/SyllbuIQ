import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
    const token = Cookies.get("sylluIQTokens");

    // If token is found, take them back home so they don't see login again
    if (token !== undefined) {
        return <Navigate to="/home" replace />;
    }

    // If no token, allow access to Login/Signup normally
    return <Outlet />;
};

export default PublicRoute;
