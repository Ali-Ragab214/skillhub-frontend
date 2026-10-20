import { useState, useEffect } from "react";
import { getAllCourses } from "../../services/courseService.js";
import Spinner from "../../components/ui/Spinner.jsx";
import ErrorMessage from "../../components/ui/ErrorMessage.jsx";
import HeroSection from "../../components/HeroSection.jsx";
import CourseCard from "../../components/CourseCard.jsx";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCourses();
      setCourses(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="courses">
        <div className="text-center mb-12">
          <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-widest">Learn Today</span>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">Featured Courses</h2>
        </div>

        {loading && <Spinner size="lg" className="py-12" />}
        {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

        {!loading && !error && courses.length === 0 && (
          <p className="text-slate-500 text-center py-12">No courses available yet.</p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
