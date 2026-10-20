import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService.js";
import useAuthStore from "../../../store/authStore.js";
import Spinner from "../../../components/ui/Spinner.jsx";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await registerUser(form.name, form.email, form.password, form.role);
      const { token: jwt, user: userData } = res.data;
      login(userData, jwt);
      const dashboards = {
        admin: "/admin/dashboard",
        student: "/student/dashboard",
        instructor: "/instructor/dashboard",
      };
      navigate(dashboards[userData.role.toLowerCase()] || "/", { replace: true });
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already registered");
      } else if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in-up">
      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-level-advanced/10 border border-level-advanced/20 rounded-lg text-sm text-level-advanced">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-surface text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-150 ${
                fieldErrors.name ? "border-level-advanced" : "border-neutral-300 dark:border-border"
              }`}
              placeholder="John Doe"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-level-advanced">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-surface text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-150 ${
                fieldErrors.email ? "border-level-advanced" : "border-neutral-300 dark:border-border"
              }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-level-advanced">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-surface text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-150 ${
                fieldErrors.password ? "border-level-advanced" : "border-neutral-300 dark:border-border"
              }`}
              placeholder="Min. 8 chars, uppercase, number, special char"
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-level-advanced">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-surface text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-150 ${
                fieldErrors.confirmPassword ? "border-level-advanced" : "border-neutral-300 dark:border-border"
              }`}
              placeholder="Repeat your password"
            />
            {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-level-advanced">{fieldErrors.confirmPassword}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-border rounded-lg bg-white dark:bg-surface text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-150"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Spinner size="sm" /> : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent/80 font-medium transition-colors duration-150">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
