import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FaTrashAlt, FaPen } from "react-icons/fa";

const IssueList = () => {
  const { id: repositoryId } = useParams();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repoName, setRepoName] = useState(""); // For displaying "archirepo > Issues"

  // Fetch issues
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

  // Fetch repository name
  const fetchRepo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/repo/${repositoryId}`);
      if (!res.ok) throw new Error("Repo fetch failed");
      const data = await res.json();
      setRepoName(data.name || "Repository");
    } catch (err) {
      console.error("Error fetching repo:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchRepo();
  }, [repositoryId]);

  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      const res = await fetch(`http://localhost:3000/issue/delete/${issueId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setIssues((prev) => prev.filter((i) => i._id !== issueId));
    } catch (err) {
      alert("Failed to delete issue");
    }
  };

  if (loading) return <div style={styles.loading}>Loading issues...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        {/* Sub-header */}
        <div style={styles.header}>
          <div style={styles.breadcrumb}>
  <span
    style={{ ...styles.repoName, cursor: "pointer", textDecoration: "underline", opacity: 0.9 }}
    onClick={() => navigate(`/repository/${repositoryId}`)}
  >
    {repoName}
  </span>
  <span style={styles.separator}>›</span>
  <span>Issues</span>
</div>

          <button
            style={styles.newIssueBtn}
            onClick={() => navigate(`/repository/${repositoryId}/issue/create`)}
          >
            New Issue
          </button>
        </div>

        {/* Issue List */}
        <div style={styles.issueList}>
          {issues.length === 0 ? (
            <p>No issues found.</p>
          ) : (
            issues.map((issue) => (
              <div key={issue._id} style={styles.issueCard}>
                <div style={styles.issueLeft}>
                  <div
                    style={{
                      ...styles.statusDot,
                      backgroundColor: issue.status === "open" ? "#2ea043" : "#a371f7",
                    }}
                  />
                  <div>
                    <h3 style={styles.issueTitle}>{issue.title}</h3>
                    <p style={styles.issueDesc}>{issue.description}</p>
                    <p style={styles.issueMeta}>
                      {issue.status === "open" ? "opened" : "closed"} 5d ago
                    </p>
                  </div>
                </div>

                <div style={styles.issueRight}>
                  <span style={styles.issueNumber}>#{issue.issueNumber || "N/A"}</span>
                  <div style={styles.iconRow}>
                    <span
                      title="Edit"
                      onClick={() => navigate(`/issue/update/${issue._id}`)}
                      style={styles.iconBtn}
                    >
                      <FaPen size={14} />
                      <span style={styles.actionText}>Update</span>
                    </span>
                    <span
                      title="Delete"
                      onClick={() => handleDelete(issue._id)}
                      style={styles.iconBtn}
                    >
                      <FaTrashAlt size={14} />
                      <span style={styles.actionText}>Delete</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    padding: "100px 20px 40px",
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px 0",
    borderBottom: "1px solid #30363d",
  },
  breadcrumb: {
    fontSize: "18px",
    fontWeight: 600,
  },
  repoName: {
  color: "#58a6ff",
  cursor: "pointer",
  textDecoration: "underline",
  opacity: 0.9,
  transition: "opacity 0.2s ease",
},

  separator: {
    margin: "0 6px",
    color: "#8b949e",
  },
  newIssueBtn: {
    backgroundColor: "#2ea043",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
  },
  issueList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  issueCard: {
    backgroundColor: "#161b22",
    borderRadius: "10px",
    padding: "18px 20px",
    border: "1px solid #30363d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  issueLeft: {
    display: "flex",
    gap: "12px",
  },
  statusDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    marginTop: "6px",
  },
  issueTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "#58a6ff",
  },
  issueDesc: {
    fontSize: "14px",
    color: "#8b949e",
    margin: "4px 0",
  },
  issueMeta: {
    fontSize: "13px",
    color: "#8b949e",
  },
  issueRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  issueNumber: {
    color: "#8b949e",
    fontSize: "13px",
  },
  iconRow: {
    display: "flex",
    gap: "12px",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#c9d1d9",
    cursor: "pointer",
    fontSize: "13px",
  },
  actionText: {
    fontSize: "13px",
  },
  loading: {
    textAlign: "center",
    padding: "30px",
  },
  error: {
    color: "#f85149",
    padding: "20px",
    textAlign: "center",
  },
};

export default IssueList;
