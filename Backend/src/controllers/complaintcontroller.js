import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const studentId = req.user.id;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle file upload result
    const imageUrl = req.file ? req.file.path : null;
    
    const complaint = new Complaint({
      title,
      description,
      category,
      studentId,
      imageUrl,
      status: 'Pending', // Matches the enum case in schema
      createdAt: new Date()
    });

    await complaint.save();
    
    res.status(201).json({
      success: true,
      message: "Complaint filed successfully",
      complaint
    });

  } catch (error) {
    console.error('Error creating complaint:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid complaint data", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ 
      message: "Failed to create complaint",
      error: error.message 
    });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({ studentId: userId })
      .populate("studentId", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Support id in params (DELETE /:id) or in body (_id)
    const id = req.params.id || req.body._id;
    if (!id) return res.status(400).json({ message: "Complaint id is required" });

    let result;
    if (role === "maintainer") {
      // Maintainers can delete any complaint
      result = await Complaint.deleteOne({ _id: id });
    } else {
      // Students can only delete their own complaints
      result = await Complaint.deleteOne({ _id: id, studentId: userId });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No complaint found or not authorized" });
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update complaint status (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Only allow known statuses
    const allowed = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate("studentId", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({ complaint: populated });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


