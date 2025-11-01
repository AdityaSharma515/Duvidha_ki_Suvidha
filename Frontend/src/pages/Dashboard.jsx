import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getUserComplaints } from "../features/complaints/complaintSlice";
import ComplaintCard from "../components/ComplaintCard";
import Loader from "../components/Loader";
import { FaHandPointRight } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { complaints = [], loading, error } = useSelector(
    (state) => state.complaints || {}
  );

  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (user?.role === 'maintainer') {
      navigate('/admin');
      return;
    }
    dispatch(getUserComplaints());
  }, [user, navigate, dispatch]);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getUserComplaints());
  }, [dispatch]);

  const filteredComplaints = complaints.filter((c) => {
    const status = (c.status || "").toString();
    if (filter !== "all" && status.toLowerCase() !== filter.toLowerCase()) return false;
    if (search && !(c.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center mt-12">{error}</p>;

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#f0f6fc] flex items-center justify-center gap-2">
        Welcome, {user?.username || "User"}
      </h2>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-[#30363d] rounded-md bg-[#0d1117] text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={() => dispatch(getUserComplaints())}
          className="px-4 py-2 bg-[#0969da] hover:bg-[#0860ca] text-white font-medium rounded-md transition-colors hover:cursor-pointer"
        >
          Refresh
        </button>
        <Link
          to="/complaint"
          className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
        >
          Raise Complaint
        </Link>
      </div>

      {/* Complaint List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-full">
            <p className="text-center mt-12 text-[#8b949e]">No complaints found.</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} isAdmin={false} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
