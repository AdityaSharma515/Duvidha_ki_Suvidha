import React from "react";
import { useDispatch } from "react-redux";
import { deleteComplaint } from "../features/complaints/complaintSlice"; // Adjust path if needed
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const ComplaintCard = ({ complaint, isAdmin = false }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      dispatch(deleteComplaint(complaint._id));
    }
  };

  return (
    <Card className="shadow-sm my-3">
      {complaint.imageUrl && (
        <Card.Img
          variant="top"
          src={complaint.imageUrl}
          alt="Complaint"
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <Card.Body>
        <Card.Title className="text-primary fw-bold">
          {complaint.title || "No Title"}
        </Card.Title>

        <Card.Text>{complaint.description || "No description provided."}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span
            className={`badge ${
              complaint.status === "resolved"
                ? "bg-success"
                : complaint.status === "pending"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {complaint.status}
          </span>

          <small className="text-muted">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </small>
        </div>

        {isAdmin && (
          <div className="mt-3 text-end">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
            >
              <i className="bi bi-trash3"></i> Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ComplaintCard;
