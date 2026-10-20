import axiosInstance from "./axiosInstance.js";

export const getAllCourses = async () => {
  const response = await axiosInstance.get("/api/v1/courses");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/courses/${id}`);
  return response.data;
};

export const getMyCourses = async () => {
  const response = await axiosInstance.get("/api/v1/courses/my-courses");
  return response.data;
};

export const getAdminAllCourses = async () => {
  const response = await axiosInstance.get("/api/v1/courses/admin/all");
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axiosInstance.post("/api/v1/courses", courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.put(`/api/v1/courses/${id}`, courseData);
  return response.data;
};

export const publishCourse = async (id) => {
  const response = await axiosInstance.patch(`/api/v1/courses/${id}/publish`);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/courses/${id}`);
  return response.data;
};
