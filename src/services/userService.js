import axiosInstance from "./axiosInstance.js";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/v1/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/users/${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/admin/users/${id}`);
  return response.data;
};
