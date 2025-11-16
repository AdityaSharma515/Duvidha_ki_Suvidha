import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getUserComplaints } from "../features/complaints/complaintSlice";
import ComplaintCard from "../components/ComplaintCard";
import Loader from "../components/Loader";
import { FaInbox, FaGlobe } from "react-icons/fa";
import Button from "../components/Button";
import ScrollToBottom from "../components/ScrollToBottom";
import NoComplaintAnimation from "../components/NoComplaintAnimation";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sort, setSort] = useState("newest"); // Sorting state

  const { complaints = [], loading, error } = useSelector(
    (state) => state.complaints || {}
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "maintainer") {
      navigate("/admin");
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
      dispatch(getUserComplaints({ public: true }));
    }
  }, [dispatch, activeTab]);

  const filteredComplaints = complaints.filter((c) => {
    const status = (c.status || "").toString();
    if (filter !== "all" && status.toLowerCase() !== filter.toLowerCase()) return false;

    if (search && !(c.title || "").toLowerCase().includes(search.toLowerCase()))
      return false;

    if (activeTab === "my" && typeFilter !== "all") {
      const isPublic = typeFilter === "public";
      if (c.isPublic !== isPublic) return false;
    }

    if (activeTab === "public" && !c.isPublic) return false;

    return true;
  });

  // ⭐ Apply Sorting (Newest → Oldest or reverse)
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sort === "newest") return dateB - dateA;
    return dateA - dateB; // oldest first
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
          className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-colors ${
            activeTab === "my"
              ? "bg-[#21262d] text-[#c9d1d9] border-b-2 border-[#58a6ff]"
              : "hover:bg-[#21262d]/50 text-[#8b949e]"
          }`}
        >
          <FaInbox />
          My Complaints
        </Button>

        <Button
          onClick={() => setActiveTab("public")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-colors ${
            activeTab === "public"
              ? "bg-[#21262d] text-[#c9d1d9] border-b-2 border-[#58a6ff]"
              : "hover:bg-[#21262d]/50 text-[#8b949e]"
          }`}
        >
          <FaGlobe />
          Public Complaints
        </Button>
      </div>
{/* Filters Section */}
<div className="flex items-center gap-3 mb-6 w-full">

  {/* Search (comes FIRST now) */}
  <input
    type="text"
    placeholder="Search complaints..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="h-10 flex-grow min-w-[200px] px-3 bg-[#0d1117] border border-[#30363d] 
               rounded-md text-[#c9d1d9] text-sm placeholder-[#8b949e] 
               focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
  />

  {/* Sort (SECOND now) */}
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="h-10 px-3 bg-[#0d1117] border border-[#30363d] 
               rounded-md text-[#c9d1d9] text-sm focus:outline-none 
               focus:ring-2 focus:ring-[#58a6ff]"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>

  {/* Status Filter */}
  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="h-10 px-3 bg-[#0d1117] border border-[#30363d] rounded-md 
               text-[#c9d1d9] text-sm focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
  >
    <option value="all">All Status</option>
    <option value="pending">Pending</option>
    <option value="in progress">In Progress</option>
    <option value="resolved">Resolved</option>
    <option value="rejected">Rejected</option>
  </select>

  {/* Type Filter — Only when "My Complaints" tab is active */}
  {activeTab === "my" && (
    <select
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
      className="h-10 px-3 bg-[#0d1117] border border-[#30363d] 
                 rounded-md text-[#c9d1d9] text-sm focus:outline-none 
                 focus:ring-2 focus:ring-[#58a6ff]"
    >
      <option value="all">All Types</option>
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  )}

</div>

      {/* Complaint List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedComplaints.length === 0 ? (
          <div className="col-span-full">
            <NoComplaintAnimation
              message="No complaints yet"
              sub="You haven't raised any complaints. Click 'Raise Complaint' to submit one."
            />
          </div>
        ) : (
          sortedComplaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} isAdmin={false} />
          ))
        )}
      </div>
      <ScrollToBottom />
    </div>
  );
};

export default Dashboard;
