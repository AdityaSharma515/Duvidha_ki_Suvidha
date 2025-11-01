import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComplaints, updateComplaintStatus, deleteComplaint } from "../features/complaints/complaintSlice";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Container, Row, Col, Form, Button, Table, Badge } from "react-bootstrap";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((state) => state.complaints);
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

  const filteredComplaints = complaints.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = async (id, newStatus) => {
    const resultAction = await dispatch(updateComplaintStatus({ id, status: newStatus }));
    if (updateComplaintStatus.fulfilled.match(resultAction)) {
      toast.success(`Complaint status updated to ${newStatus}`);
    } else {
      toast.error('Failed to update complaint status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      const resultAction = await dispatch(deleteComplaint(id));
      if (deleteComplaint.fulfilled.match(resultAction)) {
        toast.success('Complaint deleted successfully');
      } else {
        toast.error('Failed to delete complaint');
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">
        Admin Panel ⚙️ <br />
        <small className="text-muted">Welcome, {user?.username || "Admin"}</small>
      </h2>

      {/* Filter Section */}
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Complaints</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={() => dispatch(getComplaints())}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Complaint Table */}
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>User</th>
            <th>Status</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No complaints found.
              </td>
            </tr>
          ) : (
            filteredComplaints.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.title}</td>
                <td>{c.studentId?.username || "N/A"}</td>
                <td>
                  <Badge
                    bg={
                      c.status === "Resolved"
                        ? "success"
                        : c.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {c.status.toUpperCase()}
                  </Badge>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{c.description.slice(0, 40)}...</td>
                <td>
                  {c.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => handleStatusChange(c._id, "Resolved")}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="me-2"
                        onClick={() => handleStatusChange(c._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
