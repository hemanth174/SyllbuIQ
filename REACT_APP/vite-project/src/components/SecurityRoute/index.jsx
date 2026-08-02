        import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router";

const SecurityRoute = () => {
    // Get the token from cookies
    const token = Cookies.get("sylluIQTokens");

    // If token is missing, redirect to login
    if (token === undefined) {
        return <Navigate to="/login" replace />;
    }

    // If token is present, render the nested component (Home)
    return <Outlet />;
};

export default SecurityRoute;