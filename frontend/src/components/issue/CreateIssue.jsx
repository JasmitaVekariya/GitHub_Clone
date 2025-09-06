import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const styles = {
  wrapper: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "20px",
    margin: "60px auto 20px",  // margin from top added here
    maxWidth: "700px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#c9d1d9",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#238636",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#f85149",
    marginBottom: "15px",
  },
  success: {
    color: "#2ea043",
    marginBottom: "15px",
  },
};

const CreateIssue = ({ repositoryId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/issue/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          id: repositoryId, // repo ID to link issue to repo
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        setError(data || "Failed to create issue");
        return;
      }

      const data = await response.json();
      setSuccess("Issue created successfully!");
      setError("");

      // After 1 second, redirect to repository details or issues list
      setTimeout(() => {
        navigate(`/repository/${repositoryId}`);
      }, 1000);
    } catch (err) {
      setError("Error connecting to server.");
      setSuccess("");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1>Create New Issue</h1>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Issue Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...styles.input, height: "120px", resize: "vertical" }}
              required
            />
            <button type="submit" style={styles.button}>
              Create Issue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIssue;
