import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react"; // using lucide-react icons
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

      navigate(-1); // go back
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
          padding: "120px 20px 20px", // increased padding from top
          minHeight: "100vh",
          backgroundColor: "#0d1117",
          color: "#c9d1d9",
        }}
      >
        <div
          style={{
            maxWidth: "850px", // wider container
            margin: "auto",
            backgroundColor: "#161b22",
            padding: "30px",
            borderRadius: "8px",
            border: "1px solid #30363d",
          }}
        >
          {/* Title with Icon */}
          <h2
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
            }}
          >
            <AlertCircle size={22} /> Update Issue
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="title" style={{ display: "block", marginBottom: "5px" }}>
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #30363d",
                  backgroundColor: "#0d1117",
                  color: "#c9d1d9",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="description"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Description
              </label>
              <textarea
                id="description"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #30363d",
                  backgroundColor: "#0d1117",
                  color: "#c9d1d9",
                  fontSize: "14px",
                  resize: "vertical",
                }}
                required
              />
            </div>

            {/* Status */}
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="status" style={{ display: "block", marginBottom: "5px" }}>
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #30363d",
                  backgroundColor: "#0d1117",
                  color: "#c9d1d9",
                  fontSize: "14px",
                }}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {submitError && (
              <p style={{ color: "red", marginBottom: "10px" }}>{submitError}</p>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={submitLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1f6feb", // GitHub blue
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: submitLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                {submitLoading ? "Updating..." : "Update Issue"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#30363d", // gray button
                  color: "#c9d1d9",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateIssue;
