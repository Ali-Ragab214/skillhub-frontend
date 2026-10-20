import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../../../services/courseService.js";
import {
  enrollInCourse,
  getEnrollmentStatus,
  getCourseProgress,
  markLessonComplete,
} from "../../../services/enrollmentService.js";
import ReviewSection from "../../../components/course/ReviewSection.jsx";
import LevelBadge from "../../../components/ui/LevelBadge.jsx";
import useAuthStore from "../../../store/authStore.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [sectionProgress, setSectionProgress] = useState([]);

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchCourse() {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourseById(id);
      setCourse(res.data);
      setActiveSection(res.data?.sections?.[0]?.id || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load course");
      setLoading(false);
      return;
    }
    setLoading(false);

    if (!token || !user) return;

    try {
      const statusRes = await getEnrollmentStatus(id);
      const isEnrolled = statusRes.data?.enrolled;
      setEnrolled(isEnrolled);

      if (isEnrolled) {
        const progressRes = await getCourseProgress(id);
        const data = progressRes.data;
        const records = data?.records || [];
        setCompletedLessonIds(new Set(records.filter((r) => r.completed).map((r) => r.lessonId)));
        if (data) {
          setTotalLessons(data.totalLessons ?? 0);
          setCompletedCount(data.completedLessons ?? 0);
          setProgressPercent(data.completionPercentage ?? 0);
          setSectionProgress(data.sectionProgress ?? []);
        }
      }
    } catch {
      // not enrolled or not authenticated — fine
    }
  }

  const handleEnroll = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await enrollInCourse(Number(id));
      setEnrolled(true);
      const progressRes = await getCourseProgress(id);
      const data = progressRes.data;
      const records = data?.records || [];
      setCompletedLessonIds(new Set(records.filter((r) => r.completed).map((r) => r.lessonId)));
      if (data) {
        setTotalLessons(data.totalLessons ?? 0);
        setCompletedCount(data.completedLessons ?? 0);
        setProgressPercent(data.completionPercentage ?? 0);
        setSectionProgress(data.sectionProgress ?? []);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleLesson = async (lessonId) => {
    try {
      await markLessonComplete(lessonId);
      const wasCompleted = completedLessonIds.has(lessonId);
      const nextCount = completedCount + (wasCompleted ? -1 : 1);
      setCompletedCount(nextCount);
      setProgressPercent(totalLessons > 0 ? Math.round((nextCount / totalLessons) * 100) : 0);
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (next.has(lessonId)) {
          next.delete(lessonId);
        } else {
          next.add(lessonId);
        }
        return next;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update progress");
    }
  };

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourse} />;
  if (!course) return <ErrorMessage message="Course not found" />;

  const { isOwner } = course;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-accent hover:text-accent/80 transition-colors duration-200">
          &larr; Back to Courses
        </Link>
      </div>

      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border overflow-hidden mb-8">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">{course.title}</h1>
                <LevelBadge level={course.level} />
              </div>
              <p className="text-neutral-600 dark:text-muted mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-muted">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{course.instructor?.name}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{course.averageRating?.toFixed(1) || "0.0"}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{course.totalEnrollments || 0} students</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end space-y-3">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">${course.price?.toFixed(2)}</span>
              {isOwner ? (
                <span className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-surface text-neutral-500 dark:text-muted rounded-lg">
                  You own this course
                </span>
              ) : enrolled ? (
                <span className="px-3 py-1.5 text-sm bg-level-beginner/10 text-level-beginner rounded-lg font-medium">
                  Enrolled
                </span>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
                >
                  {enrolling ? <Spinner size="sm" /> : "Enroll Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {enrolled && totalLessons > 0 && (
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-neutral-900 dark:text-white">Your Progress</h2>
            <span className="text-sm text-neutral-500 dark:text-muted">{completedCount} / {totalLessons} lessons</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-border rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 dark:text-muted mt-1">{progressPercent}% complete</p>
        </div>
      )}

      {course.sections?.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Course Content</h2>
          {course.sections
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border overflow-hidden"
              >
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 dark:hover:bg-surface transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className={`w-5 h-5 text-muted transition-transform duration-200 ${
                        activeSection === section.id ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                      <span className="font-medium text-neutral-900 dark:text-white">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {enrolled && section.lessons?.length > 0 && (
                        <>
                          <span className="text-xs font-medium text-accent">
                            {(() => {
                              const secProg = sectionProgress.find((sp) => sp.sectionId === section.id);
                              const sectionCompleted = secProg?.completedLessons ?? section.lessons.filter(l => completedLessonIds.has(l.id)).length;
                              const sectionTotal = secProg?.totalLessons ?? section.lessons.length;
                              return sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
                            })()}%
                          </span>
                          <div className="w-16 bg-neutral-100 dark:bg-border rounded-full h-1.5">
                            <div
                              className="bg-accent h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${(() => {
                                const secProg = sectionProgress.find((sp) => sp.sectionId === section.id);
                                const sectionCompleted = secProg?.completedLessons ?? section.lessons.filter(l => completedLessonIds.has(l.id)).length;
                                const sectionTotal = secProg?.totalLessons ?? section.lessons.length;
                                return sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
                              })()}%` }}
                            />
                          </div>
                        </>
                      )}
                      <span className="text-sm text-muted">{section.lessons?.length || 0} lessons</span>
                    </div>
                </button>
                {activeSection === section.id && (
                  <div className="border-t border-neutral-200 dark:border-border divide-y divide-neutral-100 dark:divide-border">
                    {section.lessons
                      .slice()
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((lesson) => {
                        const isCompleted = completedLessonIds.has(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (lesson.isPreview && !enrolled) {
                                navigate(`/courses/${course.id}/lessons/${lesson.id}`);
                              }
                            }}
                            className={`flex items-center justify-between px-6 py-3 transition-colors duration-200 ${
                              lesson.isPreview && !enrolled
                                ? "cursor-pointer hover:bg-accent/5"
                                : "hover:bg-neutral-50 dark:hover:bg-surface"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {(lesson.isPreview && !enrolled) ? (
                                <span className="px-1.5 py-0.5 text-xs bg-level-beginner/10 text-level-beginner rounded font-medium">
                                  FREE
                                </span>
                              ) : (
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              <div>
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">{lesson.title}</span>
                                <span className="text-xs text-muted ml-2">{lesson.duration} min</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {lesson.isPreview && !enrolled && (
                                <span className="text-xs text-muted hover:text-accent transition-colors">
                                  Watch free &rarr;
                                </span>
                              )}
                              {enrolled && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleToggleLesson(lesson.id); }}
                                  className={`p-1 rounded transition-colors duration-200 ${
                                    isCompleted
                                      ? "text-level-beginner hover:text-level-beginner/80"
                                      : "text-neutral-300 dark:text-muted hover:text-neutral-400"
                                  }`}
                                  title={isCompleted ? "Mark incomplete" : "Mark complete"}
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-8 text-center">
          <p className="text-muted">No sections have been added to this course yet.</p>
        </div>
      )}

      <ReviewSection courseId={Number(id)} user={user} enrolled={enrolled} cardClass="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6" />
    </div>
  );
}
