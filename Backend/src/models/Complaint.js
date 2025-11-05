import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Electrical", "Repair", "Cleaning", "Other"],
    default: "Other",
  },
  imageUrl: {
    type: String, // Store Cloudinary or local URL
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  remark: {
    type: String,
  },
  remarkBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  remarkAt: {
    type: Date,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  downvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  downvoteCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
