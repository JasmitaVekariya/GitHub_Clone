import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
  FaUserCircle,
  FaStar,
  FaRegStar,
  FaCodeBranch,
  FaEye,
  FaSyncAlt,
  FaPlusCircle,
  FaBook,
  FaLock,
  FaGlobe,
  FaFile,
  FaHistory,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import FileUploadCommit from "./filesAdding";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const RepositoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [expandedCommits, setExpandedCommits] = useState(new Set());

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json", ...authHeader },
  });

  const fetchCommits = async (owner, repoName) => {
    try {
      setCommitsLoading(true);
      const response = await api.get(`/repo/${owner}/${repoName}/commits`);
      if (response.data.success) {
        setCommits(response.data.commits);
      }
    } catch (err) {
      console.error("Error fetching commits:", err);
    } finally {
      setCommitsLoading(false);
    }
  };

  const toggleCommitExpansion = (commitId) => {
    const newExpanded = new Set(expandedCommits);
    if (newExpanded.has(commitId)) {
      newExpanded.delete(commitId);
    } else {
      newExpanded.add(commitId);
    }
    setExpandedCommits(newExpanded);
  };

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await api.get(`/repo/${id}`);
        if (!response.data) throw new Error("No repo data");

        setRepo(response.data);

        const userRes = await api.get(`/userProfile/${userId}`);
        const starred = (userRes.data.starredRepos || []).some(
          (r) => r.toString() === id
        );
        setIsStarred(starred);

        // Fetch commits if repo has owner
        if (response.data.owner?.username) {
          fetchCommits(response.data.owner.username, response.data.name);
        }
      } catch (err) {
        console.error("Error fetching repo details:", err);
        setError("Failed to load repository details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [id, userId]);

  const toggleStar = async () => {
    try {
      const res = await api.post("/star", { userId, repoId: id });
      setIsStarred(res.data.isStarred);
      setRepo((prev) => ({ ...prev, stars: res.data.stars }));
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

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

          {/* Visibility Badge */}
          <div style={styles.visibilityBadge}>
            {repo?.isPublic || repo?.visibility === true ? (
              <>
                <FaGlobe size={14} color="#58a6ff" />
                <span>Public</span>
              </>
            ) : (
              <>
                <FaLock size={14} color="#f85149" />
                <span>Private</span>
              </>
            )}
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
            <div
              style={styles.statItem}
              onClick={toggleStar}
              className="cursor-pointer"
            >
              {isStarred ? (
                <FaStar color="#58a6ff" />
              ) : (
                <FaRegStar color="#8b949e" />
              )}
              <span>{repo?.stars || 0}</span>
            </div>
            <div style={styles.statItem}>
              <FaCodeBranch /> <span>{repo?.forks || 0}</span>
            </div>
            <div style={styles.statItem}>
              <FaEye /> <span>{repo?.views || 0}</span>
            </div>
          </div>

          {/* Actions Row */}
          <div style={styles.actionRow}>
            {/* ✅ Update button only for repo owner */}
            {repo?.owner?._id?.toString() === userId && (
              <div
                style={styles.actionItem}
                onClick={() => navigate(`/repository/update/${repo._id}`)}
              >
                <FaSyncAlt size={16} style={styles.icon} />
                Update Repository
              </div>
            )}
            <div
              style={styles.actionItem}
              onClick={() => navigate(`/repository/${id}/issue/create`)}
            >
              <FaPlusCircle size={16} style={styles.icon} />
              Create New Issue
            </div>
            <div
              style={styles.actionItem}
              onClick={() => navigate(`/repository/${id}/issues`)}
            >
              <FaBook size={16} style={styles.icon} />
              View Issues
            </div>
          </div>

          {/* File Upload & Commit Section */}
          {repo && repo.owner && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ color: "#58a6ff" }}>Manage Files</h3>
              <FileUploadCommit 
                user={repo.owner.username} 
                repo={repo.name} 
                onCommitSuccess={() => fetchCommits(repo.owner.username, repo.name)}
              />
            </div>
          )}

          {/* Commits History Section */}
          <div style={{ marginTop: "40px" }}>
            <div style={styles.sectionHeader}>
              <FaHistory style={{ marginRight: "8px" }} />
              <h3 style={{ color: "#58a6ff", margin: 0 }}>Commit History</h3>
            </div>
            
            {commitsLoading ? (
              <div style={styles.loading}>Loading commits...</div>
            ) : commits.length === 0 ? (
              <div style={styles.noCommits}>No commits yet</div>
            ) : (
              <div style={styles.commitsContainer}>
                {commits.map((commit, index) => (
                  <div key={commit.commitId} style={styles.commitItem}>
                    <div 
                      style={styles.commitHeader}
                      onClick={() => toggleCommitExpansion(commit.commitId)}
                    >
                      <div style={styles.commitHeaderLeft}>
                        {expandedCommits.has(commit.commitId) ? (
                          <FaChevronDown style={styles.expandIcon} />
                        ) : (
                          <FaChevronRight style={styles.expandIcon} />
                        )}
                        <div>
                          <div style={styles.commitMessage}>{commit.message}</div>
                          <div style={styles.commitMeta}>
                            {new Date(commit.timestamp).toLocaleString()} • {commit.files.length} file(s)
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedCommits.has(commit.commitId) && (
                      <div style={styles.commitFiles}>
                        <div style={styles.filesHeader}>Files in this commit:</div>
                        <div style={styles.filesList}>
                          {commit.files.map((file, fileIndex) => (
                            <div key={fileIndex} style={styles.fileItem}>
                              <FaFile style={styles.fileIcon} />
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    paddingTop: "0px",
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
  visibilityBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "12px",
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
    cursor: "pointer",
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
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #30363d",
  },
  commitsContainer: {
    maxHeight: "500px",
    overflowY: "auto",
    border: "1px solid #30363d",
    borderRadius: "8px",
    backgroundColor: "#0d1117",
  },
  commitItem: {
    borderBottom: "1px solid #21262d",
  },
  commitHeader: {
    padding: "15px 20px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    backgroundColor: "transparent",
  },
  commitHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  expandIcon: {
    color: "#8b949e",
    fontSize: "12px",
  },
  commitMessage: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#c9d1d9",
    marginBottom: "4px",
  },
  commitMeta: {
    fontSize: "14px",
    color: "#8b949e",
  },
  commitFiles: {
    padding: "0 20px 15px 20px",
    backgroundColor: "#161b22",
    borderTop: "1px solid #21262d",
  },
  filesHeader: {
    fontSize: "14px",
    color: "#8b949e",
    marginBottom: "10px",
    fontWeight: "500",
  },
  filesList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#c9d1d9",
    padding: "4px 8px",
    backgroundColor: "#0d1117",
    borderRadius: "4px",
    border: "1px solid #21262d",
  },
  fileIcon: {
    color: "#58a6ff",
    fontSize: "12px",
  },
  noCommits: {
    textAlign: "center",
    padding: "40px",
    color: "#8b949e",
    fontSize: "16px",
    fontStyle: "italic",
  },
};

export default RepositoryDetails;