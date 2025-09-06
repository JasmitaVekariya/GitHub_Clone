import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FaUserCircle, FaStar, FaCodeBranch, FaEye, FaSyncAlt, FaPlusCircle, FaBook } from "react-icons/fa";

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
          {/* Header */}
          <div style={styles.headerRow}>
            <h2 style={styles.repoName}>
              <span style={styles.blueText}>{repo?.name}</span>
            </h2>
            <div style={styles.ownerInfo}>
              <FaUserCircle size={20} style={{ marginRight: 6 }} />
              <span>Owner: {repo?.owner?.username}</span>
            </div>
          </div>

          {/* Description */}
          <p style={styles.desc}>
            {repo?.description || "No description available"}
          </p>

          {/* Dates */}
          <p style={styles.metaText}>
            Created: {new Date(repo?.createdAt).toLocaleDateString()}
          </p>
          <p style={styles.metaText}>
            Updated: {new Date(repo?.updatedAt).toLocaleDateString()}
          </p>

          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <FaStar /> <span>{repo?.stars || 100}</span>
            </div>
            <div style={styles.statItem}>
              <FaCodeBranch /> <span>{repo?.forks || 50}</span>
            </div>
            <div style={styles.statItem}>
              <FaEye /> <span>{repo?.views || 20}</span>
            </div>
          </div>

          {/* Actions Row */}
          <div style={styles.actionRow}>
            <div style={styles.actionItem} onClick={() => navigate(`/repository/update/${repo._id}`)}>
              <FaSyncAlt size={16} style={styles.icon} />
              Update Repository
            </div>
            <div style={styles.actionItem} onClick={() => navigate(`/repository/${id}/issue/create`)}>
              <FaPlusCircle size={16} style={styles.icon} />
              Create New Issue
            </div>
            <div style={styles.actionItem} onClick={() => navigate(`/repository/${id}/issues`)}>
              <FaBook size={16} style={styles.icon} />
              View Issues
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    paddingTop: "200px",
    backgroundColor: "#0d1117",
    height: "100%",
    minHeight: "200vh",
    padding: "100px 20px 30px",
    width: "100%",
    color: "#c9d1d9",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "10px",
    padding: "25px 30px",
    margin: "0 auto",
    maxWidth: "600px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  repoName: {
    fontSize: "22px",
    fontWeight: 700,
    margin: 0,
  },
  blueText: {
    color: "#58a6ff",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#c9d1d9",
  },
  desc: {
    fontSize: "16px",
    color: "#8b949e",
    marginBottom: 16,
  },
  metaText: {
    fontSize: "14px",
    color: "#8b949e",
    marginBottom: 4,
  },
  statsRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "30px",
    marginTop: 20,
    marginBottom: 25,
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "14px",
    color: "#c9d1d9",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12,
    flexWrap: "wrap",
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#c9d1d9",
    fontWeight: 500,
    // backgroundColor: "#0d1117",
    // border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "10px 14px",
    cursor: "pointer",
    transition: "background 0.2s ease",
    fontSize: "14px",
  },
  icon: {
    color: "#c9d1d9",
  },
  loading: {
    textAlign: "center",
    padding: "30px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    padding: "30px",
    color: "#f85149",
    fontSize: "18px",
  },
};

export default RepositoryDetails;
