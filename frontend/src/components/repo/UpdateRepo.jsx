import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Settings } from "lucide-react";

const styles = {
  wrapper: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    padding: "100px 20px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  card: {
    background: "linear-gradient(145deg, #161b22, #1c2128)",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "28px",
    margin: "20px auto",
    maxWidth: "720px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#f0f6fc",
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
    display: "block",
    color: "#9ca3af",
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
    height: "120px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#f0f6fc",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    marginBottom: "18px",
  },
  checkbox: {
    marginRight: "8px",
  },
  buttonBlue: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    padding: "12px 18px",
    cursor: "pointer",
    fontSize: "15px",
  },
  error: {
    color: "#f85149",
    marginBottom: "10px",
    fontSize: "14px",
  },
  success: {
    color: "#3fb950",
    marginBottom: "10px",
    fontSize: "14px",
  },
};

const UpdateRepository = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(""); // single new content entry
  const [visibility, setVisibility] = useState(true);
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
        setVisibility(data.visibility ?? true);
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
      const response = await fetch(`http://localhost:3000/repo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, content, visibility }),
      });

      if (!response.ok) {
        throw new Error("Failed to update repository");
      }

      setMessage("✅ Repository updated successfully!");

      // Redirect to detail page after short delay
      setTimeout(() => {
        navigate(`/repository/${id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("❌ Error updating repository.");
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
          <h1 style={styles.title}>
            <Settings size={22} /> Update Repository
          </h1>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <form onSubmit={handleUpdate}>
            <label style={styles.label}>Repository Name</label>
            <input
              type="text"
              placeholder="Repository Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />

            <label style={styles.label}>Add Content</label>
            <input
              type="text"
              placeholder="New content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>
              <input
                type="checkbox"
                checked={visibility}
                onChange={(e) => setVisibility(e.target.checked)}
                style={styles.checkbox}
              />
              Public Repository
            </label>

            <button type="submit" style={styles.buttonBlue}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateRepository;
