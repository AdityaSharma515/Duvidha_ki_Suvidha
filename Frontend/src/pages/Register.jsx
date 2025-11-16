import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";
import InstructionsPopup from "../components/InstructionsPopup";
 
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
      let backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(backendUrl+"/api/v1/auth/signup", formData);
      console.log("Signup success:", res.data);
      toast.success("Registered successfully!");
      navigate("/dashboard");
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        const data = error.response?.data;
        // Prefer server message; if server sent an errors array (zod issues), join them
        const message =
          data?.message ||
          (Array.isArray(data?.errors) ? data.errors.map((e) => e.message).join(", ") : null) ||
          error.message ||
          "Signup failed";
        toast.error(message);
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors bg-transparent hover:bg-transparent border-0 p-0"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
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

        <Button
          type="submit"
          className="w-full py-2 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
        >
          Register
        </Button>
      </form>
      <InstructionsPopup buttonLabel="Signup Instructions">
  <h2 className="text-xl font-semibold text-[#58a6ff]">How to Sign Up</h2>
  <ul className="list-disc pl-5 space-y-2 text-sm text-[#c9d1d9]">
    <li>Use your official college email.</li>
    <li>Create a strong password.</li>
    <li>Email must not be already registered.</li>
    <li>If you already have an account, log in instead.</li>
  </ul>

  {/* Nested Popup for Password Format */}
  <InstructionsPopup buttonLabel="View Password Format">
    <h3 className="text-lg font-semibold text-[#58a6ff]">Password Requirements</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-[#c9d1d9]">
      <li>Minimum 6 characters</li>
      <li>At least 1 uppercase letter</li>
      <li>At least 1 lowercase letter</li>
      <li>At least 1 number</li>
      <li>At least 1 special character (@, #, $, !, etc.)</li>
    </ul>
  </InstructionsPopup>
</InstructionsPopup>

    </div>
  );
};

export default Register;
