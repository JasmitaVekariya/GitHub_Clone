import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
  FaUserCircle,
  FaStar,
  FaRegStar,
  FaSyncAlt,
  FaPlusCircle,
  FaBook,
  FaLock,
  FaGlobe,
  FaFile,
  FaHistory,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
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
  const [downloadingCommit, setDownloadingCommit] = useState(null);

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


  const downloadCommit = async (commitId) => {
    if (!repo || !repo.owner || !repo.name) return;
    
    setDownloadingCommit(commitId);
    try {
      const response = await fetch(
        `${API_BASE}/repo/${repo.owner.username}/${repo.name}/download/${commitId}`,
        {
          method: 'GET',
          headers: {
            'user-id': localStorage.getItem('userId')
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download files');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${repo.name}-commit-${commitId}.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading files:', error);
      alert('Failed to download files. Please try again.');
    } finally {
      setDownloadingCommit(null);
    }
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
          {/* <p style={styles.metaText}>
            Created: {new Date(repo?.createdAt).toLocaleDateString()}
          </p>
          <p style={styles.metaText}>
            Updated: {new Date(repo?.updatedAt).toLocaleDateString()}
          </p> */}

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
            {/* <div style={styles.statItem}>
              <FaCodeBranch /> <span>{repo?.forks || 0}</span>
            </div>
            <div style={styles.statItem}>
              <FaEye /> <span>{repo?.views || 0}</span>
            </div> */}
          </div>

          {/* Actions Row */}
          <div style={styles.actionRow}>
            {/* Update button only for repo owner */}
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
          {repo && repo.owner && userId && repo.owner._id === userId && (
            <div style={{ marginTop: "30px" }}>
              <div style={styles.sectionHeader}>
                <FaPlusCircle style={{ marginRight: "8px", color: "#58a6ff" }} />
                <h3 style={{ color: "#58a6ff", margin: 0 }}>Manage Files</h3>
              </div>
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaHistory style={{ color: "#58a6ff" }} />
                <h3 style={{ color: "#58a6ff", margin: 0 }}>Commit History</h3>
              </div>
            </div>
            
            {commitsLoading ? (
              <div style={styles.loading}>Loading commits...</div>
            ) : commits.length === 0 ? (
              <div style={styles.noCommits}>No commits yet</div>
            ) : (
              <div style={styles.commitsContainer}>
                {commits.map((commit, index) => (
                  <div key={commit.commitId} style={styles.commitItem}>
                    <div style={styles.commitHeader}>
                      <div 
                        style={styles.commitHeaderLeft}
                        onClick={() => toggleCommitExpansion(commit.commitId)}
                      >
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadCommit(commit.commitId);
                        }}
                        disabled={downloadingCommit === commit.commitId}
                        style={{
                          ...styles.commitDownloadButton,
                          opacity: downloadingCommit === commit.commitId ? 0.7 : 1,
                          cursor: downloadingCommit === commit.commitId ? 'not-allowed' : 'pointer'
                        }}
                        title={`Download commit ${commit.commitId} as ZIP`}
                        onMouseEnter={(e) => {
                          if (downloadingCommit !== commit.commitId) {
                            e.target.style.backgroundColor = "#30363d";
                            e.target.style.color = "#4a9eff";
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (downloadingCommit !== commit.commitId) {
                            e.target.style.backgroundColor = "#21262d";
                            e.target.style.color = "#58a6ff";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                          }
                        }}
                      >
                        {downloadingCommit === commit.commitId ? (
                          <div style={{
                            width: "50px",
                            height: "14px",
                            border: "2px solid #58a6ff",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                          }} />
                        ) : (
                          <>
                          <FaDownload size={14} />
                          Download
                          </>
                        )}
                      </button>
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
    minHeight: "100vh",
    padding: "120px 20px 40px",
    width: "100%",
    color: "#c9d1d9",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: "linear-gradient(145deg, #161b22, #1c2128)",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "28px",
    margin: "0 auto",
    maxWidth: "800px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
    position: "relative",
    overflow: "hidden",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #30363d",
  },
  repoName: {
    fontSize: "32px",
    fontWeight: 800,
    margin: 0,
    color: "#58a6ff",
  },
  blueText: {
    color: "inherit",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#8b949e",
    fontWeight: 500,
    padding: "8px 16px",
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "1px solid #30363d",
  },
  visibilityBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#8b949e",
    padding: "6px 12px",
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "1px solid #30363d",
    width: "fit-content",
  },
  desc: {
    fontSize: "18px",
    color: "#8b949e",
    marginBottom: "24px",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  metaText: {
    fontSize: "15px",
    color: "#8b949e",
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
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "1px solid #30363d",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: "#c9d1d9",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "6px",
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
    color: "#c9d1d9",
    fontWeight: 600,
    borderRadius: "6px",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "15px",
    backgroundColor: "#21262d",
    border: "1px solid #30363d",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  icon: {
    color: "#58a6ff",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#8b949e",
    fontWeight: 500,
  },
  error: {
    textAlign: "center",
    padding: "40px",
    color: "#f85149",
    fontSize: "18px",
    fontWeight: 600,
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "1px solid #30363d",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #30363d",
  },
  commitsContainer: {
    maxHeight: "600px",
    overflowY: "auto",
    border: "1px solid #30363d",
    borderRadius: "6px",
    backgroundColor: "#0d1117",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
  },
  commitItem: {
    borderBottom: "1px solid #30363d",
    transition: "all 0.3s ease",
  },
  commitHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
    borderRadius: "6px",
    margin: "4px",
  },
  commitHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    flex: 1,
  },
  commitNumber: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#58a6ff",
    backgroundColor: "#21262d",
    padding: "6px 12px",
    borderRadius: "6px",
    minWidth: "40px",
    textAlign: "center",
    border: "1px solid #30363d",
  },
  commitContent: {
    flex: 1,
  },
  expandIcon: {
    color: "#58a6ff",
    fontSize: "14px",
    transition: "transform 0.3s ease",
  },
  commitMessage: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#c9d1d9",
    marginBottom: "6px",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  latestBadge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#3fb950",
    backgroundColor: "#21262d",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #30363d",
  },
  commitMeta: {
    fontSize: "15px",
    color: "#8b949e",
    fontWeight: 500,
  },
  commitFiles: {
    padding: "0 24px 20px 24px",
    backgroundColor: "#161b22",
    borderTop: "1px solid #30363d",
    borderRadius: "0 0 6px 6px",
  },
  filesHeader: {
    fontSize: "16px",
    color: "#c9d1d9",
    marginBottom: "16px",
    fontWeight: "600",
    padding: "12px 0",
    borderBottom: "1px solid #30363d",
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
    color: "#c9d1d9",
    padding: "12px 16px",
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "1px solid #30363d",
    transition: "all 0.2s ease",
    fontWeight: 500,
  },
  fileIcon: {
    color: "#58a6ff",
    fontSize: "14px",
  },
  noCommits: {
    textAlign: "center",
    padding: "60px 40px",
    color: "#8b949e",
    fontSize: "18px",
    fontStyle: "italic",
    backgroundColor: "#21262d",
    borderRadius: "6px",
    border: "2px dashed #30363d",
  },
  commitDownloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    backgroundColor: "#21262d",
    color: "#58a6ff",
    border: "1px solid #30363d",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginLeft: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
};

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default RepositoryDetails;