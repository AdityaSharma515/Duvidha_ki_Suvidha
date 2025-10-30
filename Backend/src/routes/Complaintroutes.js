import express from "express";
import upload from "../utils/multer.js";
import { createComplaint, getComplaints, deleteComplaint } from "../controllers/complaintcontroller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), createComplaint);
router.get("/", auth, getComplaints);
router.delete("/:id", auth, deleteComplaint);


export default router;
