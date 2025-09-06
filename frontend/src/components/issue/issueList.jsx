import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const IssueList = () => {
  const { id: repositoryId } = useParams(); // fetch repo ID from URL
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch issues function
  const fetchIssues = async () => {
    try {
      const res = await fetch(`http://localhost:3000/issue/all/${repositoryId}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [repositoryId]);

  // Delete issue handler
  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      const res = await fetch(`http://localhost:3000/issue/delete/${issueId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete issue");
      }

      // Remove deleted issue from local state
      setIssues((prevIssues) => prevIssues.filter((issue) => issue._id !== issueId));
    } catch (err) {
      alert(`Error deleting issue: ${err.message}`);
    }
  };

  if (loading) return <div>Loading issues...</div>;
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
        }}
      >
        <h2>Issues for Repository</h2>
        {issues.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {issues.map((issue) => (
              <li
                key={issue._id}
                style={{
                  border: "1px solid #30363d",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                }}
              >
                <h3 style={{ margin: 0, color: "#58a6ff" }}>{issue.title}</h3>
                <p style={{ margin: "8px 0", color: "#8b949e" }}>{issue.description}</p>
                <p style={{ fontSize: "0.9rem", color: "#c9d1d9" }}>
                  <strong>Status:</strong> {issue.status}
                </p>
                <button
                  onClick={() => navigate(`/issue/update/${issue._id}`)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#238636",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(issue._id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#cf222e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default IssueList;
