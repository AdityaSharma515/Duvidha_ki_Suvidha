import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Lightweight JWT decode helper to avoid external dependency issues.
// Decodes the JWT payload (base64url) and returns the parsed object.
function decodeJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
}

const API_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1/auth";

// 🔹 Signup user
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// 🔹 Signin user
export const signinUser = createAsyncThunk(
  "auth/signin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, data);
      const { token } = response.data;
      localStorage.setItem("token", token);

  // Decode token to get user info
  const decodedUser = decodeJwt(token);
      localStorage.setItem("user", JSON.stringify(decodedUser));

      return { token, user: decodedUser };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signin failed");
    }
  }
);

// Validate stored token on init
const storedToken = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));
const isValidToken = storedToken && storedUser && storedUser.exp * 1000 > Date.now();

// Clear invalid tokens
if (!isValidToken) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: isValidToken ? storedUser : null,
    token: isValidToken ? storedToken : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        // Normalize error to a string so components can render it easily
        state.error = (action.payload && (action.payload.message || action.payload)) || "Signup failed";
      })

      // 🔸 Signin
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        // Normalize error to a string so components can render it easily
        state.error = (action.payload && (action.payload.message || action.payload)) || "Signin failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
