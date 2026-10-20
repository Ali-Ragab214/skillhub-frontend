import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/authStore.js";

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    const links = {
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      instructor: "/instructor/dashboard",
    };
    return links[user.role.toLowerCase()] || "/";
  };

  const linkClass = (path) =>
    `text-base font-medium transition-colors duration-150 ${
      location.pathname === path
        ? "text-slate-900 dark:text-white"
        : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
    }`;

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              CoursePilot
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            {token && user && (
              <Link to={getDashboardLink()} className={linkClass(getDashboardLink())}>
                Dashboard
              </Link>
            )}
            {token && user ? (
              <div className="relative ml-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-600 text-white text-sm font-bold flex items-center justify-center hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  >
                  {initials}
                </button>
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-20">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
                      >
                        Dashboard
                      </Link>
                      <hr className="my-1 border-slate-200 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-base font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-base font-medium bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-5 py-2.5 rounded-lg transition-colors duration-150"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-3 rounded-lg text-base ${
               location.pathname === "/"
                 ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold"
                 : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
             } transition-colors duration-150`}
           >
             Home
           </Link>
           {token && user && (
             <Link
               to={getDashboardLink()}
               onClick={() => setMobileOpen(false)}
               className={`block px-4 py-3 rounded-lg text-base ${
                 location.pathname === getDashboardLink()
                   ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold"
                   : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
               } transition-colors duration-150`}
             >
               Dashboard
             </Link>
           )}
          {token && user ? (
            <>
              <div className="flex items-center gap-3 pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-600 text-white text-sm font-bold flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-base text-slate-600 dark:text-slate-300">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full text-base font-medium bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-base font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-lg transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-base font-medium bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2.5 rounded-lg transition-colors duration-150"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
