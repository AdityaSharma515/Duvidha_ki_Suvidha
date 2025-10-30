import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComplaints } from "../features/complaints/complaintSlice";
import ComplaintCard from "../components/ComplaintCard";
import Loader from "../components/Loader";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Dashboard = () => {
  const dispatch = useDispatch();

  // ✅ FIXED: Use "state.complaints" (plural)
  const { complaints = [], loading, error } = useSelector(
    (state) => state.complaints || {}
  );

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

  if (loading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">
        Welcome, {user?.username || "User"} 👋
      </h2>

      {/* 🔹 Filters Section */}
      <Row className="align-items-center mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={() => dispatch(getComplaints())}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* 🔹 Complaint List */}
      <Row>
        {filteredComplaints.length === 0 ? (
          <p className="text-center mt-5">No complaints found.</p>
        ) : (
          filteredComplaints.map((complaint) => (
            <Col key={complaint._id} md={6} lg={4} className="mb-4">
              <ComplaintCard complaint={complaint} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
