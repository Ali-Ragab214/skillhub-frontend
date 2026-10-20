import axiosInstance from "./axiosInstance.js";

export const sendMessage = async (message) => {
  const response = await axiosInstance.post("/api/v1/chat", { message });
  return response.data;
};
