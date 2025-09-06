import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const styles = {
  wrapper: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    padding: "100px 20px 20px", // padding top to avoid fixed navbar
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "700px",
  },
  title: {
    fontSize: "24px",
    color: "#58a6ff",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#f0f6fc",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "100px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#f0f6fc",
    fontSize: "1rem",
    resize: "vertical",
    outline: "none",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#238636",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  error: {
    color: "#f85149",
    marginBottom: "10px",
  },
  success: {
    color: "#3fb950",
    marginBottom: "10px",
  },
};

const UpdateRepository = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch current repository data
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository");
        }
        const data = await response.json();
        setRepo(data);
        setName(data.name || "");
        setDescription(data.description || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load repository data.");
      }
    };

    fetchRepo();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:3000/repo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update repository");
      }

      setMessage("Repository updated successfully!");

      // Redirect to detail page after short delay
      setTimeout(() => {
        navigate(`/repository/${id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Error updating repository.");
    }
  };

  if (!repo) {
    return (
      <>
        <Navbar />
        <div style={styles.wrapper}>
          <p>Loading repository...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>Update Repository</h1>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Repository Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateRepository;
