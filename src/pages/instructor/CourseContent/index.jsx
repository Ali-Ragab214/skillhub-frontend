import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../../../services/courseService.js";
import {
  createSection,
  updateSection,
  deleteSection,
  getSections,
} from "../../../services/sectionService.js";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../../services/lessonService.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

const emptySectionForm = { title: "", orderIndex: "0" };
const emptyLessonForm = {
  title: "",
  videoUrl: "",
  duration: "",
  isPreview: false,
  orderIndex: "0",
};

export default function InstructorCourseContent() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sectionForm, setSectionForm] = useState(emptySectionForm);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);
  const [sectionError, setSectionError] = useState("");

  const [editingSection, setEditingSection] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState(emptySectionForm);
  const [editSectionSubmitting, setEditSectionSubmitting] = useState(false);

  const [expandedSection, setExpandedSection] = useState(null);

  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [showLessonForm, setShowLessonForm] = useState(null);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonError, setLessonError] = useState("");

  const [editingLesson, setEditingLesson] = useState(null);
  const [editLessonForm, setEditLessonForm] = useState(emptyLessonForm);
  const [editLessonSubmitting, setEditLessonSubmitting] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getCourseById(courseId),
      getSections(courseId),
    ])
      .then(([courseRes, sectionsRes]) => {
        setCourse(courseRes.data);
        const raw = sectionsRes.data?.content || sectionsRes.data || [];
        setSections(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setError("Failed to load course content"))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    Promise.all([
      getCourseById(courseId),
      getSections(courseId),
    ])
      .then(([courseRes, sectionsRes]) => {
        setCourse(courseRes.data);
        const raw = sectionsRes.data?.content || sectionsRes.data || [];
        setSections(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setError("Failed to load course content"))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function fetchSections() {
    try {
      const res = await getSections(courseId);
      const raw = res.data?.content || res.data || [];
      setSections(Array.isArray(raw) ? raw : []);
    } catch {
      // silently fail
    }
  }

  const handleSectionChange = (e) => {
    setSectionForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSectionError("");
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!sectionForm.title.trim()) {
      setSectionError("Title is required");
      return;
    }
    setSectionSubmitting(true);
    setSectionError("");
    try {
      await createSection(courseId, {
        title: sectionForm.title.trim(),
        orderIndex: parseInt(sectionForm.orderIndex, 10) || 0,
      });
      setSectionForm(emptySectionForm);
      setShowSectionForm(false);
      fetchSections();
    } catch (err) {
      setSectionError(err.response?.data?.message || "Failed to create section");
    } finally {
      setSectionSubmitting(false);
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section.id);
    setEditSectionForm({
      title: section.title || "",
      orderIndex: section.orderIndex?.toString() || "0",
    });
    setShowSectionForm(false);
  };

  const handleEditSectionChange = (e) => {
    setEditSectionForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    if (!editSectionForm.title.trim()) return;
    setEditSectionSubmitting(true);
    try {
      await updateSection(courseId, editingSection, {
        title: editSectionForm.title.trim(),
        orderIndex: parseInt(editSectionForm.orderIndex, 10) || 0,
      });
      setEditingSection(null);
      setEditSectionForm(emptySectionForm);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update section");
    } finally {
      setEditSectionSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section and all its lessons?")) return;
    try {
      await deleteSection(courseId, sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete section");
    }
  };

  const handleLessonChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setLessonForm((prev) => ({ ...prev, [e.target.name]: value }));
    setLessonError("");
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.videoUrl.trim() || !lessonForm.duration) {
      setLessonError("Title, video URL, and duration are required");
      return;
    }
    setLessonSubmitting(true);
    setLessonError("");
    try {
      await createLesson(courseId, showLessonForm, {
        title: lessonForm.title.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        duration: parseInt(lessonForm.duration, 10),
        isPreview: lessonForm.isPreview,
        orderIndex: parseInt(lessonForm.orderIndex, 10) || 0,
      });
      setLessonForm(emptyLessonForm);
      setShowLessonForm(null);
      fetchSections();
    } catch (err) {
      setLessonError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleEditLesson = (lesson, sectionId) => {
    setEditingLesson({ lessonId: lesson.id, sectionId });
    setEditLessonForm({
      title: lesson.title || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration?.toString() || "",
      isPreview: lesson.isPreview || false,
      orderIndex: lesson.orderIndex?.toString() || "0",
    });
    setShowLessonForm(null);
  };

  const handleEditLessonChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditLessonForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!editLessonForm.title.trim() || !editLessonForm.videoUrl.trim() || !editLessonForm.duration) return;
    setEditLessonSubmitting(true);
    try {
      await updateLesson(courseId, editingLesson.sectionId, editingLesson.lessonId, {
        title: editLessonForm.title.trim(),
        videoUrl: editLessonForm.videoUrl.trim(),
        duration: parseInt(editLessonForm.duration, 10),
        isPreview: editLessonForm.isPreview,
        orderIndex: parseInt(editLessonForm.orderIndex, 10) || 0,
      });
      setEditingLesson(null);
      setEditLessonForm(emptyLessonForm);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lesson");
    } finally {
      setEditLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (sectionId, lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(courseId, sectionId, lessonId);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!course) return <ErrorMessage message="Course not found" />;

  const lessonFormFields = (
    form,
    onChange,
    submitting,
    submitLabel,
    onSubmit,
    onCancel
  ) => (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Lesson title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Video URL</label>
          <input
            type="url"
            name="videoUrl"
            value={form.videoUrl}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="https://example.com/video.mp4"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (minutes)</label>
          <input
            type="number"
            min="1"
            max="300"
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="15"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Order</label>
          <input
            type="number"
            min="0"
            name="orderIndex"
            value={form.orderIndex}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="0"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPreview"
          checked={form.isPreview}
          onChange={onChange}
          id="isPreview"
          className="w-4 h-4 text-purple-600 dark:text-purple-400 border-slate-300 dark:border-slate-700 rounded focus:ring-purple-500"
        />
        <label htmlFor="isPreview" className="text-xs text-slate-600 dark:text-slate-400">
          Free preview (visible to non-enrolled users)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white text-sm font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
        >
          {submitting ? <Spinner size="sm" /> : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <Link
          to="/instructor/my-courses"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-200 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Courses
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Content</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{course.title}</p>
        </div>
        <button
          onClick={() => {
            setShowSectionForm(!showSectionForm);
            setEditingSection(null);
          }}
          className="mt-3 sm:mt-0 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] text-sm"
        >
          {showSectionForm ? "Cancel" : "+ Add Section"}
        </button>
      </div>

      {showSectionForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">New Section</h2>
          {sectionError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {sectionError}
            </div>
          )}
          <form onSubmit={handleCreateSection} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={sectionForm.title}
                  onChange={handleSectionChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Section title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order</label>
                <input
                  type="number"
                  min="0"
                  name="orderIndex"
                  value={sectionForm.orderIndex}
                  onChange={handleSectionChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={sectionSubmitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
            >
              {sectionSubmitting ? <Spinner size="sm" /> : "Create Section"}
            </button>
          </form>
        </div>
      )}

      {sections.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 mb-4">No sections yet. Start by adding a section.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((section) => (
              <div key={section.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                  {editingSection === section.id ? (
                    <form onSubmit={handleUpdateSection} className="flex items-center gap-3">
                      <input
                        type="text"
                        name="title"
                        value={editSectionForm.title}
                        onChange={handleEditSectionChange}
                        className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <input
                        type="number"
                        min="0"
                        name="orderIndex"
                        value={editSectionForm.orderIndex}
                        onChange={handleEditSectionChange}
                        className="w-20 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={editSectionSubmitting}
                        className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg disabled:opacity-50"
                      >
                        {editSectionSubmitting ? <Spinner size="sm" /> : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingSection(null); setEditSectionForm(emptySectionForm); }}
                        className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === section.id ? null : section.id
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          <svg
                            className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                              expandedSection === section.id ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                            ({section.lessons?.length || 0} lessons)
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowLessonForm(section.id);
                            setLessonForm(emptyLessonForm);
                            setExpandedSection(section.id);
                          }}
                          className="px-3 py-1 text-xs text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30"
                        >
                          + Lesson
                        </button>
                        <button
                          onClick={() => handleEditSection(section)}
                          className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="px-3 py-1 text-xs text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {(expandedSection === section.id || showLessonForm === section.id) && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {showLessonForm === section.id && (
                      <div className="px-6 py-4 bg-purple-50/50 dark:bg-purple-900/10">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">New Lesson</h4>
                        {lessonError && (
                          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
                            {lessonError}
                          </div>
                        )}
                        {lessonFormFields(
                          lessonForm,
                          handleLessonChange,
                          lessonSubmitting,
                          "Create Lesson",
                          handleCreateLesson,
                          () => { setShowLessonForm(null); setLessonForm(emptyLessonForm); setLessonError(""); }
                        )}
                      </div>
                    )}

                    {section.lessons
                      ?.slice()
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((lesson) => (
                        <div key={lesson.id} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          {editingLesson?.lessonId === lesson.id ? (
                            <div className="bg-purple-50/50 dark:bg-purple-900/10 -mx-6 -my-3 px-6 py-3">
                              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Edit Lesson</h4>
                              {lessonFormFields(
                                editLessonForm,
                                handleEditLessonChange,
                                editLessonSubmitting,
                                "Save Changes",
                                handleUpdateLesson,
                                () => { setEditingLesson(null); setEditLessonForm(emptyLessonForm); }
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="min-w-0">
                                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate block">{lesson.title}</span>
                                  <span className="text-xs text-slate-400 dark:text-slate-500">{lesson.duration} min</span>
                                </div>
                                {lesson.isPreview && (
                                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-medium">
                                    FREE
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                <button
                                  onClick={() => handleEditLesson(lesson, section.id)}
                                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
