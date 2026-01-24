// src/utils/auth.js

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getUserId = () => localStorage.getItem("userId");

export const isLoggedIn = () => !!getToken();

export const isAdmin = () => getRole() === "ADMIN";
export const isUser = () => getRole() === "USER";

export const logout = () => {
  localStorage.clear();
};
