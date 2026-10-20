import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminAllCourses } from "../../../services/courseService.js";
import { getAllUsers } from "../../../services/userService.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalEnrollments: 0, totalRevenue: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, coursesRes] = await Promise.all([
        getAllUsers(),
        getAdminAllCourses(),
      ]);

      const users = Array.isArray(usersRes) ? usersRes : (usersRes?.data || []);
      const courses = Array.isArray(coursesRes) ? coursesRes : (coursesRes?.data || []);

      const totalEnrollments = courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0);
      const totalRevenue = null;

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments,
        totalRevenue,
      });
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      link: "/admin/users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-300",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      link: "/admin/courses",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      label: "Total Revenue",
      value: stats.totalRevenue !== null ? `$${stats.totalRevenue.toFixed(2)}` : "\u2014",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-300",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const cardContent = (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  <svg className={`w-6 h-6 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
              </div>
            </div>
          );
          return card.link
            ? <Link key={card.label} to={card.link}>{cardContent}</Link>
            : <div key={card.label}>{cardContent}</div>;
        })}
      </div>
    </div>
  );
}
