import axiosInstance from "./axiosInstance.js";

export const createSection = async (courseId, sectionData) => {
  const response = await axiosInstance.post(`/api/courses/${courseId}/sections`, sectionData);
  return response.data;
};

export const updateSection = async (courseId, sectionId, sectionData) => {
  const response = await axiosInstance.put(`/api/courses/${courseId}/sections/${sectionId}`, sectionData);
  return response.data;
};

export const deleteSection = async (courseId, sectionId) => {
  const response = await axiosInstance.delete(`/api/courses/${courseId}/sections/${sectionId}`);
  return response.data;
};

export const getSections = async (courseId) => {
  const response = await axiosInstance.get(`/api/courses/${courseId}/sections`);
  return response.data;
};
