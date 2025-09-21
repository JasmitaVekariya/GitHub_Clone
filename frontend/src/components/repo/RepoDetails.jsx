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
        // Sort commits by timestamp in descending order (latest first)
        const sortedCommits = response.data.commits.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setCommits(sortedCommits);
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
                <FaGlobe size={16} color="#059669" />
                <span>Public Repository</span>
              </>
            ) : (
              <>
                <FaLock size={16} color="#dc2626" />
                <span>Private Repository</span>
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
                        <div style={styles.commitNumber}>
                          #{commits.length - index}
                        </div>
                        <div style={styles.commitContent}>
                          <div style={styles.commitMessage}>
                            {commit.message}
                            {index === 0 && (
                              <span style={styles.latestBadge}>Latest</span>
                            )}
                          </div>
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
    backgroundColor: "#f8fafc",
    height: "100%",
    minHeight: "100vh",
    padding: "120px 20px 40px",
    width: "100%",
    color: "#1e293b",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
    padding: "40px",
    margin: "0 auto",
    maxWidth: "800px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    position: "relative",
    overflow: "hidden",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e2e8f0",
  },
  repoName: {
    fontSize: "32px",
    fontWeight: 800,
    margin: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  blueText: {
    color: "inherit",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#64748b",
    fontWeight: 500,
    padding: "8px 16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  visibilityBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#059669",
    padding: "6px 12px",
    backgroundColor: "#d1fae5",
    borderRadius: "8px",
    border: "1px solid #a7f3d0",
    width: "fit-content",
  },
  desc: {
    fontSize: "18px",
    color: "#475569",
    marginBottom: "24px",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  metaText: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: 500,
  },
  statsRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "24px",
    marginTop: "32px",
    marginBottom: "32px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: "#475569",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    fontWeight: 600,
    backgroundColor: "transparent",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#475569",
    fontWeight: 600,
    borderRadius: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "15px",
    backgroundColor: "#f1f5f9",
    border: "2px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  icon: {
    color: "#667eea",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#64748b",
    fontWeight: 500,
  },
  error: {
    textAlign: "center",
    padding: "40px",
    color: "#dc2626",
    fontSize: "18px",
    fontWeight: 600,
    backgroundColor: "#fef2f2",
    borderRadius: "12px",
    border: "1px solid #fecaca",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e2e8f0",
  },
  commitsContainer: {
    maxHeight: "600px",
    overflowY: "auto",
    border: "2px solid #e2e8f0",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  commitItem: {
    borderBottom: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
  },
  commitHeader: {
    padding: "20px 24px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
    borderRadius: "12px",
    margin: "4px",
  },
  commitHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  commitNumber: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#667eea",
    backgroundColor: "#e0e7ff",
    padding: "6px 12px",
    borderRadius: "8px",
    minWidth: "40px",
    textAlign: "center",
    border: "1px solid #c7d2fe",
  },
  commitContent: {
    flex: 1,
  },
  expandIcon: {
    color: "#667eea",
    fontSize: "14px",
    transition: "transform 0.3s ease",
  },
  commitMessage: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "6px",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  latestBadge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#059669",
    backgroundColor: "#d1fae5",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #a7f3d0",
  },
  commitMeta: {
    fontSize: "15px",
    color: "#64748b",
    fontWeight: 500,
  },
  commitFiles: {
    padding: "0 24px 20px 24px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    borderRadius: "0 0 12px 12px",
  },
  filesHeader: {
    fontSize: "16px",
    color: "#475569",
    marginBottom: "16px",
    fontWeight: "600",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  filesList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    color: "#475569",
    padding: "12px 16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    fontWeight: 500,
  },
  fileIcon: {
    color: "#667eea",
    fontSize: "14px",
  },
  noCommits: {
    textAlign: "center",
    padding: "60px 40px",
    color: "#64748b",
    fontSize: "18px",
    fontStyle: "italic",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "2px dashed #e2e8f0",
  },
};

export default RepositoryDetails;