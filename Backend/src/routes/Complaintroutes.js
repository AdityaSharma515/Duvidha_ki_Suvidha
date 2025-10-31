import express from "express";
import upload from "../utils/multer.js";
import { createComplaint, getComplaints, deleteComplaint, updateComplaintStatus, getUserComplaints } from "../controllers/complaintcontroller.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// User endpoints
router.post("/", auth, upload.single("image"), createComplaint);
router.get("/user", auth, getUserComplaints);

// Admin-only endpoints
router.get("/all", auth, requireRole("maintainer"), getComplaints);
router.patch("/:id", auth, requireRole("maintainer"), updateComplaintStatus);
router.delete("/:id", auth, requireRole("maintainer"), deleteComplaint);


export default router;
