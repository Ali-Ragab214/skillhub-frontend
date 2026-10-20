import axiosInstance from "./axiosInstance.js";

export const submitReview = async (courseId, { rating, comment }) => {
  const response = await axiosInstance.post(`/api/courses/${courseId}/reviews`, { rating, comment });
  return response.data;
};

export const getMyReview = async (courseId) => {
  const response = await axiosInstance.get(`/api/courses/${courseId}/reviews/my`);
  return response.data;
};

export const getCourseReviews = async (courseId) => {
  const response = await axiosInstance.get(`/api/courses/${courseId}/reviews`);
  return response.data;
};
