import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getUserComplaints } from "../features/complaints/complaintSlice";
import ComplaintCard from "../components/ComplaintCard";
import Loader from "../components/Loader";
import { FaInbox, FaGlobe } from "react-icons/fa";
import Button from "../components/Button";

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

  const [activeTab, setActiveTab] = useState("my");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (activeTab === "my") {
      dispatch(getUserComplaints());
    } else {
      // ToDo: Replace with the actual action for public complaints
      dispatch(getUserComplaints({ public: true }));
    }
  }, [dispatch, activeTab]);

  const filteredComplaints = complaints.filter((c) => {
    // Filter by status
    const status = (c.status || "").toString();
    if (filter !== "all" && status.toLowerCase() !== filter.toLowerCase()) return false;

    // Filter by search
    if (search && !(c.title || "").toLowerCase().includes(search.toLowerCase())) return false;

    // Filter by type (only in "My Complaints" tab)
    if (activeTab === "my" && typeFilter !== "all") {
      const isPublic = typeFilter === "public";
      if (c.isPublic !== isPublic) return false;
    }

    // Filter by tab
    if (activeTab === "public" && !c.isPublic) return false;

    return true;
  });

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center mt-12">{error}</p>;

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-[#f0f6fc]">
          Welcome, {user?.username || "User"}
        </h2>
        <Link
          to="/complaint"
          className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors"
        >
          Raise Complaint
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#30363d]">
        <Button
          onClick={() => setActiveTab("my")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-colors ${activeTab === "my"
              ? 'bg-[#21262d] text-[#c9d1d9] border-b-2 border-[#58a6ff]'
              : 'hover:bg-[#21262d]/50 text-[#8b949e]'
            }`}
        >
          <FaInbox />
          My Complaints
        </Button>
        <Button
          onClick={() => setActiveTab("public")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-colors ${activeTab === "public"
              ? 'bg-[#21262d] text-[#c9d1d9] border-b-2 border-[#58a6ff]'
              : 'hover:bg-[#21262d]/50 text-[#8b949e]'
            }`}
        >
          <FaGlobe />
          Public Complaints
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        {activeTab === "my" && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        )}
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
