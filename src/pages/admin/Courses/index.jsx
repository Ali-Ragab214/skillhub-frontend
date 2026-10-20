import { useState, useEffect } from "react";
import { getAdminAllCourses, deleteCourse } from "../../../services/courseService.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAllCourses();
      setCourses(res.data || []);
    } catch {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete course "${title}"? This will remove all sections, lessons, and enrollments.`)) return;
    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(null);
    }
  }

  const statusColors = {
    PUBLISHED: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    DRAFT: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    ARCHIVED: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  };

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourses} />;

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
        <div className="mt-3 sm:mt-0 relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instructor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{c.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.instructor?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.totalEnrollments || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[c.status] || "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        disabled={deleting === c.id}
                        className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        {deleting === c.id ? <Spinner size="sm" /> : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
