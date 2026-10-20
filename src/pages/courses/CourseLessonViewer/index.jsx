import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../../../services/courseService.js";
import Spinner from "../../../components/ui/Spinner.jsx";

function isYouTubeUrl(url) {
  return url && (url.includes("youtube.com") || url.includes("youtu.be"));
}

function getYouTubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

export default function CourseLessonViewer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function fetchCourse() {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourseById(courseId);
      setCourse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) {
    return (
      <div className="animate-fade-in-up min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-neutral-500 dark:text-muted mb-6">{error}</p>
          <Link
            to={`/courses/${courseId}`}
            className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const sections = course?.sections || [];
  let lesson = null;
  let section = null;
  for (const s of sections) {
    const found = (s.lessons || []).find((l) => String(l.id) === String(lessonId));
    if (found) {
      lesson = found;
      section = s;
      break;
    }
  }

  if (!lesson) {
    return (
      <div className="animate-fade-in-up min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Lesson not found</h2>
          <Link
            to={`/courses/${courseId}`}
            className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const isPreview = !!lesson.isPreview;

  const allLessons = [];
  for (const s of (sections || []).sort((a, b) => a.orderIndex - b.orderIndex)) {
    for (const l of (s.lessons || []).sort((a, b) => a.orderIndex - b.orderIndex)) {
      allLessons.push(l);
    }
  }
  const currentIdx = allLessons.findIndex((l) => String(l.id) === String(lessonId));
  const prevLessonId = currentIdx > 0 ? allLessons[currentIdx - 1].id : null;
  const nextLessonId = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1].id : null;

  const isYt = isYouTubeUrl(lesson.videoUrl);
  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          to={`/courses/${courseId}`}
          className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {course?.title || "Course"}
        </Link>
      </div>

      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border overflow-hidden mb-6 relative">
        {lesson.videoUrl ? (
          isYt ? (
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black">
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full"
              />
            </div>
          )
        ) : (
          <div className="aspect-video w-full bg-neutral-100 dark:bg-surface flex items-center justify-center">
            <svg className="w-16 h-16 text-neutral-300 dark:text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{lesson.title}</h1>
              {isPreview && (
                <span className="px-2 py-0.5 text-xs bg-level-beginner/10 text-level-beginner rounded font-medium">
                  FREE
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 dark:text-muted">
              {section?.title} &middot; {lesson.duration} min
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (prevLessonId) navigate(`/courses/${courseId}/lessons/${prevLessonId}`);
          }}
          disabled={!prevLessonId}
          className="flex items-center gap-1 px-4 py-2 text-sm text-neutral-600 dark:text-muted border border-neutral-300 dark:border-border rounded-lg hover:bg-neutral-50 dark:hover:bg-surface transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Lesson
        </button>
        <button
          onClick={() => {
            if (nextLessonId) navigate(`/courses/${courseId}/lessons/${nextLessonId}`);
          }}
          disabled={!nextLessonId}
          className="flex items-center gap-1 px-4 py-2 text-sm text-neutral-600 dark:text-muted border border-neutral-300 dark:border-border rounded-lg hover:bg-neutral-50 dark:hover:bg-surface transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next Lesson
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
