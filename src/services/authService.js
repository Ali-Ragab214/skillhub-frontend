import axiosInstance from "./axiosInstance.js";

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/api/v1/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (name, email, password, role) => {
  const response = await axiosInstance.post("/api/v1/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};
