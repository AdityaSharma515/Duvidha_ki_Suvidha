import React from "react";
import { useDispatch } from "react-redux";
import { deleteComplaint, upvoteComplaint, downvoteComplaint } from "../features/complaints/complaintSlice";
import { FaTrash, FaThumbsUp, FaThumbsDown, FaArrowUp, FaLongArrowAltUp, FaCartArrowDown, FaLongArrowAltDown } from "react-icons/fa";
import Button from "./Button";

const ComplaintCard = ({ complaint, isAdmin = false }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      dispatch(deleteComplaint(complaint._id));
    }
  };

  const handleUpvote = () => {
    dispatch(upvoteComplaint(complaint._id));
  };

  const handleDownvote = () => {
    dispatch(downvoteComplaint(complaint._id));
  };

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "resolved") return "bg-green-500 text-white";
    if (s === "pending") return "bg-yellow-500 text-black";
    if (s === "rejected") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getTypeColor = (isPublic) => {
    return isPublic
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-orange-100 text-orange-800 border-orange-200";
  };

  const timeAgo = (input) => {
    if (!input) return "N/A";
    const date = new Date(input);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
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

        <div className="flex flex-wrap gap-2 mb-3">
          {complaint.category && (
            <span className="px-2 py-1 bg-[#21262d] rounded text-xs text-[#c9d1d9]">
              {complaint.category}
            </span>
          )}
          <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(complaint.isPublic)}`}>
            {complaint.isPublic ? "Public" : "Private"}
          </span>
        </div>

        {complaint.remark && (
          <div className="mb-3">
            <p className="text-sm text-[#9aa4b2]">
              <strong className="text-[#c9d1d9]">Remark: </strong>
              {complaint.remark}
            </p>
            <p className="text-xs text-[#8b949e] mt-1">
              By: {complaint.remarkBy?.username || 'Maintainer'} • {complaint.remarkAt ? timeAgo(complaint.remarkAt) : 'N/A'}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status || "Unknown"}
            </span>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpvote}
                className={`flex items-center gap-1 text-sm transition-colors ${complaint.hasUpvoted
                    ? 'text-green-500'
                    : 'text-[#8b949e] hover:text-green-500'
                  }`}
              >
                <FaLongArrowAltUp size={14} />
                <span>{complaint.upvoteCount || 0}</span>
              </Button>

              <Button
                onClick={handleDownvote}
                className={`flex items-center gap-1 text-sm transition-colors ${complaint.hasDownvoted
                    ? 'text-red-500'
                    : 'text-[#8b949e] hover:text-red-500'
                  }`}
              >
                <FaLongArrowAltDown size={14} />
                <span>{complaint.downvoteCount || 0}</span>
              </Button>
            </div>
          </div>

          <span className="text-sm text-[#8b949e]">
            {timeAgo(complaint.createdAt)}
          </span>
        </div>

        {isAdmin && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleDelete}
              className="px-3 py-1 text-sm border border-red-600 text-red-600 hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-2"
            >
              <FaTrash />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
