import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createComplaint } from "../features/complaints/complaintSlice.js";
import { FaTools } from "react-icons/fa";

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
    <div className="container mx-auto mt-12 max-w-2xl px-4">
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#f0f6fc] flex items-center justify-center gap-2">
        <FaTools className="text-[#58a6ff]" /> Register a Hostel Complaint
      </h2>
      <form 
        className="p-6 border border-[#30363d] rounded-lg bg-[#161b22]"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            placeholder="e.g., Broken fan in room"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent min-h-[120px] resize-y"
            placeholder="Describe your issue..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Category</label>
          <select
            name="category"
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Upload Image (Optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#21262d] file:text-[#c9d1d9] hover:file:bg-[#30363d]"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default ComplaintForm;
