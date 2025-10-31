import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createComplaint } from "../features/complaints/complaintSlice.js";

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.complaints);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

      dispatch(createComplaint(data))
        .unwrap()
        .then(() => {
          toast.success("Complaint registered successfully!");
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error("Failed to register complaint");
        });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛠️ Register a Hostel Complaint</h2>
      <form className="p-4 border rounded shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., Broken fan in room"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Describe your issue..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electrical">Electrical</option>
            <option value="Repair">Repair</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image (Optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default ComplaintForm;
