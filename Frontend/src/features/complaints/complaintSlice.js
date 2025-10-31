import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

const ENDPOINT = "/complaints";

// ✅ Get all complaints (Admin only)
export const getComplaints = createAsyncThunk(
  "complaint/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${ENDPOINT}/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch complaints");
    }
  }
);

// ✅ Get user's complaints
export const getUserComplaints = createAsyncThunk(
  "complaint/getUserComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${ENDPOINT}/user`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch complaints");
    }
  }
);

// ✅ Create new complaint
export const createComplaint = createAsyncThunk(
  "complaint/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post(ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create complaint");
    }
  }
);

// ✅ Update complaint status (Admin only)
export const updateComplaintStatus = createAsyncThunk(
  "complaint/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`${ENDPOINT}/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

// ✅ Delete complaint
export const deleteComplaint = createAsyncThunk(
  "complaint/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${ENDPOINT}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete complaint");
    }
  }
);

// ✅ Slice
const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaints: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All (Admin)
      .addCase(getComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.complaints || [];
      })
      .addCase(getComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get User Complaints
      .addCase(getUserComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.complaints || [];
      })
      .addCase(getUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.push(action.payload.complaint);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const updatedComplaint = action.payload.complaint;
        const index = state.complaints.findIndex((c) => c._id === updatedComplaint._id);
        if (index !== -1) {
          state.complaints[index] = updatedComplaint;
        }
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default complaintSlice.reducer;
