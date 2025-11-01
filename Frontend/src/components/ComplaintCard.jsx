import React from "react";
import { useDispatch } from "react-redux";
import { deleteComplaint } from "../features/complaints/complaintSlice";
import { FaTrash } from "react-icons/fa";

const ComplaintCard = ({ complaint, isAdmin = false }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      dispatch(deleteComplaint(complaint._id));
    }
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "resolved") return "bg-green-500 text-white";
    if (s === "pending") return "bg-yellow-500 text-black";
    if (s === "rejected") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      {complaint.imageUrl && (
        <img
          src={complaint.imageUrl}
          alt="Complaint"
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-[#58a6ff]">
          {complaint.title || "No Title"}
        </h3>

        <p className="text-[#8b949e] mb-4 text-sm">
          {complaint.description || "No description provided."}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(complaint.status)}`}>
            {complaint.status || "Unknown"}
          </span>

          <span className="text-sm text-[#8b949e]">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isAdmin && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm border border-red-600 text-red-600 hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-2"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
