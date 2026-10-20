import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore.js";
import ReviewSection from "../../../components/course/ReviewSection.jsx";
import { getEnrollmentStatus, getCourseProgress, enrollInCourse, markLessonComplete } from "../../../services/enrollmentService.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import LevelBadge from "../../../components/ui/LevelBadge.jsx";
import StarRating from "../../../components/ui/StarRating.jsx";

export function ErrorBoundary() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-neutral-500 dark:text-muted mb-6">Failed to load course details.</p>
        <Link
          to="/student/my-courses"
          className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
        >
          Back to My Courses
        </Link>
      </div>
    </div>
  );
}

export default function StudentCourseDetails() {
  const { course: initialCourse, sections: initialSections } = useLoaderData();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const course = initialCourse;
  const sections = initialSections;
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [sectionProgress, setSectionProgress] = useState([]);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      Promise.resolve().then(() => setLoadingStatus(false));
      return;
    }
    let cancelled = false;
    getEnrollmentStatus(course.id)
      .then((statusRes) => {
        if (cancelled) return null;
        const isEnrolled = statusRes.data?.enrolled;
        setEnrolled(isEnrolled);
        return isEnrolled ? getCourseProgress(course.id) : null;
      })
      .then((progressRes) => {
        if (cancelled || !progressRes) return null;
        const data = progressRes.data;
        const records = Array.isArray(data) ? data : (data?.records || []);
        setCompletedLessonIds(new Set(records.filter((r) => r.completed).map((r) => r.lessonId)));
        if (data && !Array.isArray(data)) {
          setTotalLessons(data.totalLessons ?? 0);
          setCompletedCount(data.completedLessons ?? 0);
          setProgressPercent(data.completionPercentage ?? 0);
          setSectionProgress(data.sectionProgress ?? []);
          setCourseCompleted(data.completionPercentage === 100);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingStatus(false); });
    return () => { cancelled = true; };
  }, [token, user, course.id]);

  const handleEnroll = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await enrollInCourse(course.id);
      setEnrolled(true);
      const progressRes = await getCourseProgress(course.id);
      const data = progressRes.data;
      const records = Array.isArray(data) ? data : (data?.records || []);
      setCompletedLessonIds(new Set(records.filter((r) => r.completed).map((r) => r.lessonId)));
      if (data && !Array.isArray(data)) {
        setTotalLessons(data.totalLessons ?? 0);
        setCompletedCount(data.completedLessons ?? 0);
        setProgressPercent(data.completionPercentage ?? 0);
        setSectionProgress(data.sectionProgress ?? []);
        setCourseCompleted(data.completionPercentage === 100);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleViewLesson = (lesson) => {
    if (!enrolled) {
      navigate(`/student/courses/${course.id}/lessons/${lesson.id}`);
      return;
    }

    if (completedLessonIds.has(lesson.id)) {
      navigate(`/student/courses/${course.id}/lessons/${lesson.id}`);
      return;
    }

    const newCompletedCount = completedCount + 1;
    const newProgressPercent = totalLessons > 0 ? Math.round((newCompletedCount / totalLessons) * 100) : 0;

    const sectionId = sections.find((s) => s.lessons?.some((l) => l.id === lesson.id))?.id;

    setCompletedLessonIds((prev) => new Set(prev).add(lesson.id));
    setCompletedCount(newCompletedCount);
    setProgressPercent(newProgressPercent);

    if (sectionId) {
      setSectionProgress((prev) =>
        prev.map((sp) =>
          sp.sectionId === sectionId
            ? { ...sp, completedLessons: sp.completedLessons + 1 }
            : sp
        )
      );
    }

    navigate(`/student/courses/${course.id}/lessons/${lesson.id}`);

    const syncProgress = (progressRes) => {
      const data = progressRes.data;
      const records = Array.isArray(data) ? data : (data?.records || []);
      setCompletedLessonIds(new Set(records.filter((r) => r.completed).map((r) => r.lessonId)));
      if (data && !Array.isArray(data)) {
        setTotalLessons(data.totalLessons ?? 0);
        setCompletedCount(data.completedLessons ?? 0);
        setProgressPercent(data.completionPercentage ?? 0);
        setSectionProgress(data.sectionProgress ?? []);
        setCourseCompleted(data.completionPercentage === 100);
      }
    };

    markLessonComplete(lesson.id)
      .then(() => getCourseProgress(course.id))
      .then(syncProgress)
      .catch(() => getCourseProgress(course.id).then(syncProgress));
  };

  if (loadingStatus) {
    return (
      <div className="animate-fade-in-up">
        <Spinner size="lg" className="py-20" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="animate-fade-in-up min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Course not found</h2>
          <Link
            to="/student/my-courses"
            className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const instructorName = course.instructor?.name || "Unknown";
  const instructorInitial = instructorName.charAt(0).toUpperCase();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <Link
          to="/student/my-courses"
          className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Courses
        </Link>
      </div>

      {/* Course Hero Card */}
      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">{course.title}</h1>
              <LevelBadge level={course.level} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-muted mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center text-white text-xs font-bold">
                  {instructorInitial}
                </div>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{instructorName}</span>
              </div>
              <StarRating rating={course.averageRating || 0} filledColor="text-amber-400" emptyColor="text-slate-200" />
              <span className="font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                  {course.averageRating?.toFixed(1) || "0.0"}
                </span>
              <span className="flex items-center gap-1 text-neutral-400 dark:text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {course.totalEnrollments || 0} students
              </span>
            </div>

          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">${course.price?.toFixed(2)}</span>
            {enrolled ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-level-beginner/10 text-level-beginner rounded-lg font-medium text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Enrolled
              </span>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 active:scale-[0.98] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {enrolling ? <Spinner size="sm" /> : "Enroll Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column — Description + Instructor */}
        <div className="lg:col-span-3 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">About This Course</h2>
            <p className="text-neutral-600 dark:text-muted leading-relaxed">{course.description || "No description available."}</p>
          </div>

          {/* Instructor Card */}
          <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Your Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/80 flex items-center justify-center text-white text-lg font-bold shrink-0">
                {instructorInitial}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">{instructorName}</h3>
                {course.instructor?.email && (
                  <p className="text-sm text-neutral-500 dark:text-muted">{course.instructor.email}</p>
                )}
                <p className="text-sm text-neutral-400 dark:text-muted mt-1">Course Instructor</p>
              </div>
            </div>
          </div>

          <ReviewSection courseId={course.id} user={user} enrolled={enrolled} />
        </div>

        {/* Right Column — Sections Accordion */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Course Content</h2>
            {sections.length === 0 ? (
              <p className="text-neutral-400 dark:text-muted text-sm text-center py-8">No sections available yet.</p>
            ) : (
              <div className="space-y-3">
                {sections
                  .slice()
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((section) => {
                    const sectionLessons = section.lessons?.slice().sort((a, b) => a.orderIndex - b.orderIndex) || [];
                    const secProg = sectionProgress.find((sp) => sp.sectionId === section.id);
                    const sectionCompleted = secProg?.completedLessons ?? sectionLessons.filter(l => completedLessonIds.has(l.id)).length;
                    const sectionTotal = secProg?.totalLessons ?? sectionLessons.length;
                    const sectionPct = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;

                    return (
                      <div key={section.id} className="border border-neutral-200 dark:border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-surface transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                                activeSection === section.id ? "rotate-90" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-left">
                              <span className="font-medium text-neutral-900 dark:text-white text-sm">{section.title}</span>
                              <span className="text-xs text-muted ml-2">{sectionLessons.length} lessons</span>
                            </div>
                          </div>
                          {enrolled && sectionLessons.length > 0 && (
                            <span className="text-xs font-medium text-accent">{sectionPct}%</span>
                          )}
                        </button>
                        {enrolled && sectionLessons.length > 0 && (
                          <div className="px-4 pb-2">
                            <div className="w-full bg-neutral-100 dark:bg-border rounded-full h-1.5">
                              <div
                                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${sectionPct}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {activeSection === section.id && (
                          <div className="border-t border-neutral-100 dark:border-border divide-y divide-neutral-50 dark:divide-border">
                            {sectionLessons.map((lesson) => {
                              const isCompleted = completedLessonIds.has(lesson.id);
                              const isFreePreview = !enrolled && lesson.isPreview;
                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center justify-between px-4 py-3 transition-colors duration-200 ${
                                    isFreePreview || enrolled
                                      ? "cursor-pointer hover:bg-accent/5"
                                      : ""
                                  } ${isCompleted ? "text-accent" : "text-neutral-600 dark:text-muted"}`}
                                  onClick={() => {
                                    if (isFreePreview || enrolled) handleViewLesson(lesson);
                                  }}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isFreePreview ? (
                                      <span className="px-1.5 py-0.5 text-xs bg-level-beginner/10 text-level-beginner rounded font-medium shrink-0">
                                        FREE
                                      </span>
                                    ) : !enrolled ? (
                                      <span className="text-muted text-sm shrink-0">Locked</span>
                                    ) : isCompleted ? (
                                      <svg className="w-5 h-5 text-level-beginner shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    <span className="text-sm truncate">{lesson.title}</span>
                                  </div>
                                  <span className="text-xs text-muted shrink-0 ml-2">{lesson.duration} min</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
