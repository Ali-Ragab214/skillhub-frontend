import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    const dashboards = {
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      instructor: "/instructor/dashboard",
    };
    const fallback = dashboards[user.role.toLowerCase()] || "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
