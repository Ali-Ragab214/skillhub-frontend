import { Link } from "react-router-dom";
import LevelBadge from "./ui/LevelBadge.jsx";

export default function CourseCard({ course }) {
  const instructorName = course.instructor?.name || "Unknown";
  const instructorInitial = instructorName.charAt(0).toUpperCase();
  const rating = course.averageRating || 0;
  const roundedRating = Math.round(rating);

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-200 overflow-hidden block"
    >
      <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="absolute top-3 left-3">
          <LevelBadge level={course.level} />
        </span>
        <span className="absolute top-3 right-3 text-base font-bold text-slate-900 dark:text-white bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm backdrop-blur-sm">
          ${course.price?.toFixed(2)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-slate-400 dark:bg-slate-500 flex items-center justify-center text-white text-[10px] font-bold">
            {instructorInitial}
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{instructorName}</span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-base lg:text-lg leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-3.5 h-3.5 ${star <= roundedRating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {course.totalEnrollments || 0} students
          </span>
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors duration-150">
            Enroll &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
