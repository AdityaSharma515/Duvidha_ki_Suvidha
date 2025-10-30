import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const studentId = req.user.id;


    const complaint = new Complaint({
      title,
      description,
      category,
      studentId,
      imageUrl: req.file ? req.file.path : null, // Cloudinary image URL
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint filed successfully", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({ studentId: userId })
      .populate("studentId", "name email")
      .populate("assignedTo", "name email");

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id } = req.body;

    const result = await Complaint.deleteOne({ _id, studentId: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No complaint found for this user" });
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};


