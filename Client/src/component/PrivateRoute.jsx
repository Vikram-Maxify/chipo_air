import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    );

    // Wait until profile API completes
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Loading...
            </div>
        );
    }

    // Redirect if not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;