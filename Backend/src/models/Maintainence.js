import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const MaintenanceLog = mongoose.model("MaintenanceLog", maintenanceLogSchema);
export default MaintenanceLog;
