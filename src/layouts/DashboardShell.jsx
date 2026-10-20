import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/authStore.js";

const colorConfig = {
  indigo: { badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" },
  amber: { badge: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300" },
  slate: { badge: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase" },
};

export default function DashboardShell({ navLinks, portalTitle, accentColor = "indigo" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const cc = colorConfig[accentColor] || colorConfig.indigo;
  const isAdmin = accentColor === "slate";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const profilePath = navLinks.find((l) => l.label === "Profile")?.to || "/profile";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-bg-primary flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-surface border-r border-neutral-200 dark:border-border transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-border">
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {portalTitle}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 dark:text-muted hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? `bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium`
                    : `text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800`
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-surface border-b border-neutral-200 dark:border-border"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-neutral-500 dark:text-muted hover:bg-neutral-100 dark:hover:bg-surface transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {isAdmin ? (
              <>
                <span className="text-sm text-neutral-500 dark:text-muted">{user?.name}</span>
                <span className={`px-2 py-1 text-xs font-medium ${cc.badge} rounded-full`}>
                  Admin
                </span>
              </>
            ) : (
              <Link
                to={profilePath}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-surface transition-colors duration-150 group"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-700 dark:bg-neutral-600 text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{user?.name}</span>
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </Link>
            )}
            {!isAdmin && (
              <span className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-medium ${cc.badge} rounded-full`}>
                {accentColor === "indigo" ? "Student" : "Instructor"}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
