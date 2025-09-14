import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const CreateIssue = ({ repositoryId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const styles = {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "100px 20px 20px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    },
    card: {
      width: "100%",
      maxWidth: "720px",
      background: "linear-gradient(145deg, #161b22, #1c2128)",
      borderRadius: "8px",
      padding: "28px",
      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.4)",
      color: "#f0f6fc",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "1px solid #30363d",
      paddingBottom: "10px",
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      marginBottom: "6px",
      color: "#9ca3af",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "18px",
      backgroundColor: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "6px",
      color: "#f0f6fc",
      fontSize: "14px",
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      marginBottom: "18px",
      backgroundColor: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "6px",
      color: "#f0f6fc",
      fontSize: "14px",
      outline: "none",
      resize: "vertical",
      height: "120px",
    },
    button: {
      backgroundColor: "#3b82f6", // same as Create Repo
      color: "#fff",
      fontWeight: 600,
      border: "none",
      borderRadius: "6px",
      padding: "12px 18px",
      cursor: "pointer",
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
   
    message: {
      marginTop: "18px",
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      textAlign: "center",
      fontWeight: 600,
    },
    success: {
      color: "#3fb950",
    },
    error: {
      color: "#f85149",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/issue/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, id: repositoryId }),
      });

      if (!response.ok) {
        const data = await response.text();
        setMessage(data || "Failed to create issue");
        return;
      }

      const data = await response.json();
      setMessage("Issue created successfully!");

      setTimeout(() => navigate(`/repository/${repositoryId}`), 1000);
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>📝 Create New Issue</h2>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Issue Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
              placeholder="Enter issue title"
            />

            <label style={styles.label}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              required
              placeholder="Describe the issue"
            />

            <button type="submit" style={styles.button}>
            Create Issue
            </button>
          </form>

          {message && (
            <p
              style={{
                ...styles.message,
                ...(message.includes("Failed") || message.includes("Error")
                  ? styles.error
                  : styles.success),
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateIssue;
