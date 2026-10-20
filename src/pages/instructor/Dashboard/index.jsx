import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/v1/instructor/dashboard");
      setDashboard(res.data?.data ?? res.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  if (!dashboard) return null;

  const statsCards = [
    {
      label: "Courses Created",
      value: (dashboard.totalPublishedCourses ?? 0) > 0
        ? `${dashboard.totalCourses ?? 0} (${dashboard.totalPublishedCourses} published)`
        : (dashboard.totalCourses ?? 0),
      to: "/instructor/my-courses",
      valueClass: "text-white",
      labelClass: "text-purple-200",
      cardBg: "bg-purple-600 dark:bg-purple-700",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      label: "Total Students",
      value: dashboard.totalStudentsEnrolled ?? 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-300",
    },
    {
      label: "Average Rating",
      value: dashboard.weightedAverageRating?.toFixed(1) ?? "0.0",
      icon: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-300",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card) => {
          const Wrapper = card.to ? "a" : "div";
          const wrapperProps = card.to
            ? { href: card.to, onClick: (e) => { e.preventDefault(); navigate(card.to); } }
            : {};
          return (
            <Wrapper
              key={card.label}
              {...wrapperProps}
              className={`rounded-xl shadow-sm p-6 ${
                card.cardBg || "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              } ${
                card.to ? "cursor-pointer hover:shadow-md hover:brightness-110 transition-all duration-200" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold mb-1 ${card.labelClass || "text-slate-500 dark:text-slate-400"}`}>{card.label}</p>
                  <p className={`text-4xl font-bold ${card.valueClass || "text-slate-900 dark:text-slate-100"}`}>{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  <svg className={`w-6 h-6 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {dashboard.recentEnrollments?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Enrollments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {dashboard.recentEnrollments.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{e.studentName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{e.courseTitle}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {dashboard.topPerformingCourses?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Top Performing Courses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {dashboard.topPerformingCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{c.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.totalEnrollments || 0}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.averageRating?.toFixed(1) || "0.0"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          c.status === "PUBLISHED"
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                            : c.status === "DRAFT"
                            ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
