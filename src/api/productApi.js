import axiosInstance from "./axiosInstance";

export const getAllProducts = () => {
  return axiosInstance.get("/api/products");
};
