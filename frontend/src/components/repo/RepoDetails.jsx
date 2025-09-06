import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const styles = {
  wrapper: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    padding: "100px 20px 20px", // 🔥 Top padding added
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
    marginBottom: "10px",
  },
  desc: {
    fontSize: "16px",
    color: "#8b949e",
    marginBottom: "10px",
  },
  label: {
    fontWeight: 600,
    color: "#c9d1d9",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "#f85149",
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
    marginTop: "20px",
    transition: "background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#2ea043",
  },
};

const RepositoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository");
        }
        const data = await response.json();
        setRepo(data);
      } catch (err) {
        console.error("Error fetching repo details:", err);
        setError("Failed to load repository details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading repository...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>{repo?.name}</h1>
          <p style={styles.desc}>
            {repo?.description || "No description available"}
          </p>
          <p>
            <span style={styles.label}>Owner:</span>{" "}
            {repo?.owner?.username || "Unknown"}
          </p>
          <p>
            <span style={styles.label}>Created At:</span>{" "}
            {new Date(repo?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span style={styles.label}>Updated At:</span>{" "}
            {new Date(repo?.updatedAt).toLocaleDateString()}
          </p>

          {/* 🔥 Update Button */}
          <button
            style={styles.button}
            onClick={() => navigate(`/repository/update/${repo._id}`)}
          >
            Update Repository
          </button>
          <button
            onClick={() => navigate(`/repository/${id}/issue/create`)}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              backgroundColor: "#238636",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Create New Issue
          </button>
        <button onClick={() => navigate(`/repository/${id}/issues`)}>View Issues</button>
           

        </div>
      </div>
    </>
  );
};

export default RepositoryDetails;
