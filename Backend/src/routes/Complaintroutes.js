import express from "express";
import upload from "../utils/multer.js";
import { createComplaint, getComplaints, deleteComplaint, updateComplaintStatus, getUserComplaints, getComplaintById } from "../controllers/complaintcontroller.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();
//api/v1/complaints/{__}
//User endpoints
router.post("/", auth, requireRole("student"), upload.single("image"), createComplaint);
router.get("/user", auth, getUserComplaints);

// Admin-only endpoints
router.get("/all", auth, requireRole("maintainer"), getComplaints);
// get single complaint
router.get("/:id", auth, requireRole("maintainer"), getComplaintById);
router.patch("/:id", auth, requireRole("maintainer"), updateComplaintStatus);
router.delete("/:id", auth, requireRole("maintainer"), deleteComplaint);


export default router;
