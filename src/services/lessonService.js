import axiosInstance from "./axiosInstance.js";

export const createLesson = async (courseId, sectionId, lessonData) => {
  const response = await axiosInstance.post(`/api/courses/${courseId}/sections/${sectionId}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (courseId, sectionId, lessonId, lessonData) => {
  const response = await axiosInstance.put(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (courseId, sectionId, lessonId) => {
  const response = await axiosInstance.delete(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
  return response.data;
};

