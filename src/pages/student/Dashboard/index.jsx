import { Link } from "react-router-dom";
import useMyEnrollments from "../../../hooks/useMyEnrollments.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

export default function StudentDashboard() {
  const { enrollments, loading, error, refetch } = useMyEnrollments();

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">My Dashboard</h1>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-neutral-500 dark:text-muted">
          You are enrolled in <span className="font-semibold text-neutral-700 dark:text-neutral-300">{enrollments.length}</span> course{enrollments.length !== 1 ? "s" : ""}
        </p>
        <Link
          to="/"
          className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] text-sm"
        >
          Browse All Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-12 text-center">
          <svg className="w-16 h-16 text-neutral-300 dark:text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-neutral-500 dark:text-muted mb-4">You haven't enrolled in any courses yet</p>
          <Link
            to="/"
            className="inline-block bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id || enrollment.courseId}
              className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                {enrollment.courseTitle || `Course #${enrollment.courseId}`}
              </h3>
              <div className="mb-1">
                <div className="flex justify-between text-sm text-neutral-500 dark:text-muted mb-1">
                  <span>Progress</span>
                  <span>{enrollment.progress || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-border rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress || 0}%` }}
                  />
                </div>
              </div>
              {enrollment.completedLessons !== undefined && (
                <p className="text-xs text-neutral-400 dark:text-muted mb-4">
                  {enrollment.completedLessons} / {enrollment.totalLessons} lessons completed
                </p>
              )}
              <Link
                to={`/student/courses/${enrollment.courseId}`}
                className="inline-block w-full text-center bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] text-sm"
              >
                Continue
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
