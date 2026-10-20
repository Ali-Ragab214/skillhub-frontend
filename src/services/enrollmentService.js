import axiosInstance from "./axiosInstance.js";

export const enrollInCourse = async (courseId) => {
  const response = await axiosInstance.post("/api/enrollments", { courseId });
  return response.data;
};

export const getEnrollmentStatus = async (courseId) => {
  const response = await axiosInstance.get(`/api/enrollments/${courseId}/status`);
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const response = await axiosInstance.get(`/api/courses/${courseId}/progress`);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await axiosInstance.get("/api/enrollments/my");
  return response.data;
};

export const markLessonComplete = async (lessonId) => {
  const response = await axiosInstance.post(`/api/lessons/${lessonId}/progress`);
  return response.data;
};

export const deleteLessonProgress = async (lessonId) => {
  const response = await axiosInstance.delete(`/api/lessons/${lessonId}/progress`);
  return response.data;
};
