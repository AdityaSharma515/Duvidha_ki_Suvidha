import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/v1/auth";

// ✅ Signup API
export const signupApi = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Signup failed. Please try again later."
    );
  }
};

// ✅ Signin API
export const signinApi = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, userData);
    // store token in localStorage for persistence
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Signin failed. Please check your credentials."
    );
  }
};

// ✅ Logout (frontend-only)
export const logoutApi = () => {
  localStorage.removeItem("token");
};

