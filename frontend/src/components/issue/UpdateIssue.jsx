import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const UpdateIssue = () => {
  const { id } = useParams(); // issue ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch current issue data
  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/issue/${id}`);
        if (!res.ok) throw new Error("Failed to fetch issue data");
        const data = await res.json();
        setTitle(data.issue.title || "");
        setDescription(data.issue.description || "");
        setStatus(data.issue.status || "open");
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!title.trim() || !description.trim()) {
      setSubmitError("Title and description are required.");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/issue/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update issue");
      }

      // Optionally, you can await res.json() here if you want to use returned data

      // Redirect back to issues list for the repository
      navigate(-1); // Go back to previous page or customize path if needed
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>Loading issue data...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "100px 20px 20px",
          minHeight: "100vh",
          backgroundColor: "#0d1117",
          color: "#c9d1d9",
          maxWidth: "600px",
          margin: "auto",
          borderRadius: "8px",
        }}
      >
        <h2>Update Issue</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title" style={{ display: "block", marginBottom: "5px" }}>
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #30363d",
                backgroundColor: "#0d1117",
                color: "#c9d1d9",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>
              Description:
            </label>
            <textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #30363d",
                backgroundColor: "#0d1117",
                color: "#c9d1d9",
                resize: "vertical",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="status" style={{ display: "block", marginBottom: "5px" }}>
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #30363d",
                backgroundColor: "#0d1117",
                color: "#c9d1d9",
              }}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {submitError && <p style={{ color: "red", marginBottom: "10px" }}>{submitError}</p>}

          <button
            type="submit"
            disabled={submitLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#238636",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: submitLoading ? "not-allowed" : "pointer",
            }}
          >
            {submitLoading ? "Updating..." : "Update Issue"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateIssue;
