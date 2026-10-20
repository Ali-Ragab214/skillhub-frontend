import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService.js";
import useAuthStore from "../../../store/authStore.js";
import Spinner from "../../../components/ui/Spinner.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const dashboards = {
        admin: "/admin/dashboard",
        student: "/student/dashboard",
        instructor: "/instructor/dashboard",
      };
      navigate(dashboards[user.role.toLowerCase()] || "/", { replace: true });
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form.email, form.password);
      const { token: jwt, user: userData } = res.data;
      login(userData, jwt);
      const dashboards = {
        admin: "/admin/dashboard",
        student: "/student/dashboard",
        instructor: "/instructor/dashboard",
      };
      navigate(dashboards[userData.role.toLowerCase()] || "/", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in-up">
      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-level-advanced/10 border border-level-advanced/20 rounded-lg text-sm text-level-advanced">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-white dark:bg-surface text-neutral-900 dark:text-white transition-colors duration-150"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-white dark:bg-surface text-neutral-900 dark:text-white transition-colors duration-150"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Spinner size="sm" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:text-accent/80 font-medium transition-colors duration-150">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
