import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyCourses, createCourse, updateCourse, publishCourse, deleteCourse } from "../../../services/courseService.js";
import Spinner from "../../../components/ui/Spinner.jsx";
import ErrorMessage from "../../../components/ui/ErrorMessage.jsx";

const emptyForm = { title: "", description: "", price: "", level: "BEGINNER", status: "DRAFT" };

export default function InstructorMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editFormError, setEditFormError] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyCourses();
      setCourses(res.data || []);
    } catch {
      setError("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      setFormError("Title and price are required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await createCourse({
        ...form,
        price: parseFloat(form.price),
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price?.toString() || "",
      level: course.level || "BEGINNER",
      status: course.status || "DRAFT",
    });
    setEditFormError("");
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditFormError("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditFormError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.price) {
      setEditFormError("Title and price are required");
      return;
    }
    setSubmittingEdit(true);
    setEditFormError("");
    try {
      await updateCourse(editingId, {
        ...editForm,
        price: parseFloat(editForm.price),
      });
      handleCancelEdit();
      fetchCourses();
    } catch (err) {
      setEditFormError(err.response?.data?.message || "Failed to update course");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handlePublish = async (id) => {
    setPublishingId(id);
    try {
      await publishCourse(id);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish course");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  const statusColors = {
    PUBLISHED: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    DRAFT: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    ARCHIVED: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  };

  if (loading) return <Spinner size="lg" className="py-20" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourses} />;

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-3 sm:mt-0 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] text-sm"
        >
          {showForm ? "Cancel" : "+ New Course"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Course</h2>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Course description (optional)"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? <Spinner size="sm" /> : "Create Course"}
            </button>
          </form>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't created any courses yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id}>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[c.status] || "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      ${c.price?.toFixed(2)} &middot; {c.level} &middot; {c.totalEnrollments || 0} students &middot; {c.averageRating?.toFixed(1) || "0.0"} rating
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/instructor/courses/${c.id}/content`}
                      className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-150"
                    >
                      Content
                    </Link>
                    {c.status === "DRAFT" && (
                      <button
                        onClick={() => handlePublish(c.id)}
                        disabled={publishingId === c.id}
                        className="px-3 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors duration-150 disabled:opacity-50"
                      >
                        {publishingId === c.id ? "Publishing..." : "Publish"}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {editingId === c.id && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-6 mb-4 mt-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Edit Course</h2>
                  {editFormError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                      {editFormError}
                    </div>
                  )}
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="Course title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                        <select
                          name="level"
                          value={editForm.level}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="BEGINNER">Beginner</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="ADVANCED">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="Course description"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="submit"
                        disabled={submittingEdit}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
                      >
                        {submittingEdit ? <Spinner size="sm" /> : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
