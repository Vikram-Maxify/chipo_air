import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
    const { admin, isAuthChecked } = useSelector((state) => state.admin);

    // 🧠 jab tak auth check complete nahi hota → kuch mat karo
    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }

    // ❌ agar check ke baad bhi admin nahi
    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    // ✅ sab sahi
    return <Outlet />;
};

export default AdminPrivateRoute;