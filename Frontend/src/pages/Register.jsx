import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    roomNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side: enforce institutional email domain
    const domainRegex = /^[A-Za-z0-9._%+-]+@iiitdwd\.ac\.in$/;
    if (!domainRegex.test(formData.email)) {
      toast.error("Email must end with @iiitdwd.ac.in");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/v1/auth/signup", formData);
      console.log("Signup success:", res.data);
      toast.success("Registered successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container mx-auto my-12 max-w-md px-4">
      <h2 className="text-center text-2xl font-semibold mb-6 text-[#f0f6fc]">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email (must end with @iiitdwd.ac.in)"
            value={formData.email}
            onChange={handleChange}
            /* pattern removed because some browsers reject the regex string; validation is performed in JS and server-side */
            title="Please enter an email ending with @iiitdwd.ac.in"
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            placeholder="Room number (optional)"
            value={formData.roomNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#c9d1d9]">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
          >
            <option value="student">Student</option>
            <option value="maintainer">Maintainer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
