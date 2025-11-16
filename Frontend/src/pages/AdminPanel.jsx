import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComplaints, updateComplaintStatus, deleteComplaint } from "../features/complaints/complaintSlice";
import toast from "react-hot-toast";
import API from "../api/axios.js";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { FaCog, FaEye } from "react-icons/fa";
import ScrollToBottom from "../components/ScrollToBottom";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((state) => state.complaints);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("public");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [remarkTarget, setRemarkTarget] = useState({ id: null, status: null });

  // ⭐ Sorting state
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

  // ⭐ Existing vote-based sorting for public tab
  const sortByVotes = (complaints) => {
    return [...complaints].sort((a, b) => {
      if (b.upvoteCount !== a.upvoteCount) {
        return b.upvoteCount - a.upvoteCount;
      }
      return a.downvoteCount - b.downvoteCount;
    });
  };

  // ⭐ FIXED filtering (removed the broken <select> from inside filter)
  const filteredComplaints = complaints.filter((c) => {
    const statusMatch =
      filter === "all" ||
      (c.status && c.status.toLowerCase() === filter.toLowerCase());

    const searchMatch =
      !search ||
      (c.title && c.title.toLowerCase().includes(search.toLowerCase()));

    const typeMatch = activeTab === "public" ? c.isPublic : !c.isPublic;

    return statusMatch && searchMatch && typeMatch;
  });

  // ⭐ NEW — Date Sorting (Newest → Oldest or Oldest → Newest)
  const dateSortedComplaints = [...filteredComplaints].sort((a, b) => {
    const da = new Date(a.createdAt);
    const db = new Date(b.createdAt);
    return sort === "newest" ? db - da : da - db;
  });

  // ⭐ Final sorting output:
  // Public tab → sort by votes THEN date
  // Private tab → sort ONLY by date
  const sortedComplaints =
    activeTab === "public"
      ? sortByVotes(dateSortedComplaints)
      : dateSortedComplaints;

  const handleStatusChange = async (id, newStatus, remark) => {
    try {
      const resultAction = await dispatch(
        updateComplaintStatus({ id, status: newStatus, remark })
      );
      if (updateComplaintStatus.fulfilled.match(resultAction)) {
        toast.success(`Complaint status updated to ${newStatus}`);
        dispatch(getComplaints());
      } else {
        toast.error(resultAction.payload || "Failed to update complaint status");
      }
    } catch (error) {
      toast.error("Failed to update complaint status");
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const resultAction = await dispatch(deleteComplaint(id));
        if (deleteComplaint.fulfilled.match(resultAction)) {
          toast.success('Complaint deleted successfully');
          // Refresh the complaints list
          dispatch(getComplaints());
        } else {
          toast.error(resultAction.payload || 'Failed to delete complaint');
        }
      } catch (error) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  const handleView = async (id) => {
    try {
      // Fetch single populated complaint from backend to ensure student details are present
      const res = await API.get(`/complaints/${id}`);
      const complaint = res.data?.complaint;
      if (complaint) setSelectedComplaint(complaint);
      else toast.error('Failed to load complaint details');
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      toast.error('Failed to load complaint details');
    }
  };

  const getStatusBadgeColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "resolved") return "bg-green-500 text-white";
    if (s === "rejected") return "bg-red-500 text-white";
    if (s === "in progress") return "bg-blue-500 text-white";
    return "bg-yellow-500 text-black";
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center mt-12">{error}</p>;

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-[#f0f6fc] flex items-center justify-center gap-2">
          <FaCog className="text-[#58a6ff]" /> Admin Panel
        </h2>
        <small className="text-base font-normal text-[#8b949e]">Welcome, {user?.username || "Admin"}</small>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#30363d]">
        <Button
          onClick={() => setActiveTab("public")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "public"
              ? 'text-[#f0f6fc] border-b-2 border-[#58a6ff]'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
        >
          Public Complaints
        </Button>
        <Button
          onClick={() => setActiveTab("private")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "private"
              ? 'text-[#f0f6fc] border-b-2 border-[#58a6ff]'
              : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
        >
          Private Complaints
        </Button>
      </div>

      {/* Filter Section */}
<div className="flex items-center gap-4 mb-6 w-full">

  {/* Search (broad input, grows to fill space) */}
  <input
    type="text"
    placeholder="Search complaints..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="h-10 flex-grow min-w-[250px] px-3 bg-[#0d1117] border border-[#30363d] 
               rounded-md text-[#c9d1d9] text-sm placeholder-[#8b949e]
               focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
  />

  {/* Sort */}
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
    className="h-10 px-3 bg-[#0d1117] border border-[#30363d] 
               rounded-md text-[#c9d1d9] text-sm focus:outline-none 
               focus:ring-2 focus:ring-[#58a6ff]"
  >
    <option value="all">All Complaints</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Rejected">Rejected</option>
  </select>

  {/* Refresh Button */}
  <Button
    onClick={() => dispatch(getComplaints())}
    className="h-10 px-4 bg-[#0969da] hover:bg-[#0860ca] 
               text-white font-medium rounded-md transition-colors"
  >
    Refresh
  </Button>
</div>
 

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
          <div className="text-sm text-[#8b949e] mb-1">
            {activeTab === "public" ? "Public Complaints" : "Private Complaints"}
          </div>
          <div className="text-2xl font-semibold text-[#f0f6fc]">
            {complaints.filter(c => activeTab === "public" ? c.isPublic : !c.isPublic).length}
          </div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
          <div className="text-sm text-[#8b949e] mb-1">Pending</div>
          <div className="text-2xl font-semibold text-yellow-500">
            {filteredComplaints.filter(c => (c.status || "").toLowerCase() === "pending").length}
          </div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
          <div className="text-sm text-[#8b949e] mb-1">Resolved</div>
          <div className="text-2xl font-semibold text-green-500">
            {filteredComplaints.filter(c => (c.status || "").toLowerCase() === "resolved").length}
          </div>
        </div>
      </div>

      {/* Complaint Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#30363d] rounded-lg">
          <thead className="bg-[#21262d]">
            <tr>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">#</th>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Title</th>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Student Name</th>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Category</th>
              {activeTab === "public" && (
                <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Votes</th>
              )}
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Status</th>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Date</th>
              <th className="border border-[#30363d] px-4 py-3 text-left text-sm font-semibold text-[#f0f6fc]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedComplaints.length === 0 ? (
              <tr>
                <td colSpan="8" className="border border-[#30363d] px-4 py-8 text-center text-[#8b949e]">
                  {complaints.length === 0 ? "No complaints found." : "No complaints match your filters."}
                </td>
              </tr>
            ) : (
              sortedComplaints.map((c, i) => (
                <tr key={c._id} className="hover:bg-[#21262d] transition-colors">
                  <td className="border border-[#30363d] px-4 py-3 text-[#c9d1d9]">{i + 1}</td>
                  <td className="border border-[#30363d] px-4 py-3 text-[#c9d1d9] font-medium">{c.title || "No Title"}</td>
                  <td className="border border-[#30363d] px-4 py-3 text-[#c9d1d9]">
                    {c.studentId?.username || c.studentId?.name || "N/A"}
                  </td>
                  <td className="border border-[#30363d] px-4 py-3 text-[#c9d1d9]">
                    <span className="px-2 py-1 bg-[#21262d] rounded text-xs">{c.category || "N/A"}</span>
                  </td>
                  {activeTab === "public" && (
                    <td className="border border-[#30363d] px-4 py-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-500">+{c.upvoteCount || 0}</span>
                        <span className="text-red-500">-{c.downvoteCount || 0}</span>
                      </div>
                    </td>
                  )}
                  <td className="border border-[#30363d] px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(c.status)}`}>
                      {c.status || "Unknown"}
                    </span>
                  </td>
                  <td className="border border-[#30363d] px-4 py-3 text-[#c9d1d9] text-sm">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="border border-[#30363d] px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => handleView(c._id)}
                        className="px-3 py-1 text-sm border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-colors flex items-center gap-1 hover:cursor-pointer"
                      >
                        <FaEye className="text-xs" />
                        View
                      </Button>
                      {c.status === "Pending" && (
                        <>
                          <Button
                            onClick={() => handleStatusChange(c._id, "In Progress")}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors hover:cursor-pointer"
                          >
                            Start
                          </Button>
                          <Button
                            onClick={() => { setRemarkTarget({ id: c._id, status: 'Resolved' }); setRemarkText(''); setRemarkModalOpen(true); }}
                            className="px-3 py-1 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors hover:cursor-pointer"
                          >
                            Resolve
                          </Button>
                          <Button
                            onClick={() => { setRemarkTarget({ id: c._id, status: 'Rejected' }); setRemarkText(''); setRemarkModalOpen(true); }}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors hover:cursor-pointer"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {c.status === "In Progress" && (
                        <>
                          <Button
                            onClick={() => { setRemarkTarget({ id: c._id, status: 'Resolved' }); setRemarkText(''); setRemarkModalOpen(true); }}
                            className="px-3 py-1 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors"
                          >
                            Resolve
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(c._id, "Pending")}
                            className="px-3 py-1 text-sm border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-colors hover:cursor-pointer"
                          >
                            Back to Pending
                          </Button>
                        </>
                      )}
                      {(c.status === "Resolved" || c.status === "Rejected") && (
                        <Button
                          onClick={() => handleStatusChange(c._id, "Pending")}
                          className="px-3 py-1 text-sm border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-colors"
                        >
                          Reopen
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1 text-sm border border-red-600 text-red-600 hover:bg-red-900/20 rounded-md transition-colors hover:cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[#f0f6fc]">{selectedComplaint.title}</h3>
                <Button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-[#8b949e] hover:text-[#f0f6fc] text-2xl leading-none hover:cursor-pointer"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#8b949e]">Status</label>
                  <div>
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusBadgeColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status || "Unknown"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e]">Submitted By</label>
                  <div className="text-[#c9d1d9]">{selectedComplaint.studentId?.username || selectedComplaint.studentId?.name || "N/A"}</div>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e]">Room Number</label>
                  <div className="text-[#c9d1d9]">{selectedComplaint.studentId?.roomNumber || selectedComplaint.studentId?.roomnumber || selectedComplaint.roomNumber || selectedComplaint.studentRoomNumber || "N/A"}</div>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e]">Email</label>
                  <div className="text-[#c9d1d9]">{selectedComplaint.studentId?.email || selectedComplaint.email || "N/A"}</div>
                </div>

                {selectedComplaint.remark && (
                  <div>
                    <label className="text-sm text-[#8b949e]">Remark</label>
                    <div className="text-[#c9d1d9]">{selectedComplaint.remark}</div>
                    <div className="text-xs text-[#8b949e] mt-1">By: {selectedComplaint.remarkBy?.username || 'N/A'} • {selectedComplaint.remarkAt ? new Date(selectedComplaint.remarkAt).toLocaleString() : 'N/A'}</div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-[#8b949e]">Type</label>
                  <div>
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${selectedComplaint.isPublic ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {selectedComplaint.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e]">Category</label>
                  <div className="text-[#c9d1d9]">{selectedComplaint.category || "N/A"}</div>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e]">Description</label>
                  <div className="text-[#c9d1d9] whitespace-pre-wrap">{selectedComplaint.description || "No description"}</div>
                </div>

                {selectedComplaint.imageUrl && (
                  <div>
                    <label className="text-sm text-[#8b949e]">Image</label>
                    <div className="mt-2">
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="Complaint"
                        className="max-w-full rounded-md border border-[#30363d]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-[#8b949e]">Created</label>
                  <div className="text-[#c9d1d9]">
                    {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remark Modal */}
      {remarkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRemarkModalOpen(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#f0f6fc] mb-3">Add Remark</h3>
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Add a remark (optional)"
              className="w-full h-28 p-3 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-md"
            />
              <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => setRemarkModalOpen(false)}
                className="px-3 py-1 border border-[#30363d] text-[#c9d1d9] rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setRemarkModalOpen(false);
                  await handleStatusChange(remarkTarget.id, remarkTarget.status, remarkText);
                  setRemarkTarget({ id: null, status: null });
                  setRemarkText('');
                }}
                className="px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      <ScrollToBottom />
    </div>
  );
};

export default AdminPanel;
