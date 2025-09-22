import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FaStar, FaBook, FaCode, FaEye, FaCodeBranch, FaSpinner } from "react-icons/fa";

const StarredRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${userId}/starred`);
        if (!response.ok) throw new Error("Failed to fetch starred repos");

        const data = await response.json();
        setRepos(data.starredRepos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredRepos();
  }, [userId]);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Navigation Tabs */}
        <div style={styles.navTabs}>
          <div style={styles.tabContainer}>
            <button 
              style={styles.tab}
              onClick={() => navigate("/profile")}
            >
              <FaBook style={styles.tabIcon} />
              Overview
            </button>
            <button style={styles.activeTab}>
              <FaStar style={styles.tabIcon} />
              Starred Repositories
            </button>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              <FaStar style={styles.titleIcon} />
              Starred Repositories
            </h2>
            <div style={styles.count}>
              {repos.length} {repos.length === 1 ? 'repository' : 'repositories'}
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading starred repositories...</p>
            </div>
          ) : repos.length > 0 ? (
            <div style={styles.reposGrid}>
              {repos.map((repo) => (
                <div
                  style={styles.repoCard}
                  key={repo._id}
                  onClick={() => navigate(`/repository/${repo._id}`)}
                >
                  <div style={styles.repoHeader}>
                    <h4 style={styles.repoTitle}>{repo.name}</h4>
                    <div style={styles.repoVisibility}>
                      {repo.visibility ? (
                        <FaEye style={styles.visibilityIcon} />
                      ) : (
                        <FaCodeBranch style={styles.visibilityIcon} />
                      )}
                    </div>
                  </div>
                  
                  <p style={styles.repoDescription}>
                    {repo.description || "No description provided"}
                  </p>
                  
                  <div style={styles.repoFooter}>
                    <span style={styles.repoLanguage}>
                      {repo.language || "Unknown"}
                    </span>
                    <div style={styles.repoStats}>
                      <span style={styles.repoStat}>
                        <FaStar style={styles.repoStatIcon} />
                        {repo.stars || 0}
                      </span>
                      <span style={styles.repoStat}>
                        <FaCodeBranch style={styles.repoStatIcon} />
                        {repo.forks || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FaStar style={styles.emptyIcon} />
              <p style={styles.emptyText}>No starred repositories</p>
              <p style={styles.emptySubtext}>Start exploring and star repositories you find interesting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0d1117",
    padding: "120px 20px 40px",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  navTabs: {
    maxWidth: "1200px",
    margin: "0 auto 32px",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "4px",
    backdropFilter: "blur(10px)",
  },
  activeTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#1e293b",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tabIcon: {
    fontSize: "16px",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#161b22",
    borderRadius: "6px",
    padding: "32px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
    border: "1px solid #30363d",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #30363d",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#c9d1d9",
    margin: 0,
  },
  titleIcon: {
    color: "#fbbf24",
    fontSize: "20px",
  },
  count: {
    fontSize: "16px",
    color: "#8b949e",
    fontWeight: "500",
  },
  reposGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  repoCard: {
    background: "#21262d",
    borderRadius: "6px",
    padding: "24px",
    border: "1px solid #30363d",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  repoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  repoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#58a6ff",
    margin: 0,
  },
  repoVisibility: {
    color: "#8b949e",
  },
  visibilityIcon: {
    fontSize: "16px",
  },
  repoDescription: {
    fontSize: "14px",
    color: "#8b949e",
    margin: "0 0 16px 0",
    lineHeight: "1.5",
  },
  repoFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repoLanguage: {
    fontSize: "12px",
    color: "#58a6ff",
    fontWeight: "600",
    padding: "4px 8px",
    backgroundColor: "#21262d",
    borderRadius: "6px",
  },
  repoStats: {
    display: "flex",
    gap: "12px",
  },
  repoStat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#8b949e",
    fontWeight: "500",
  },
  repoStatIcon: {
    fontSize: "12px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#8b949e",
  },
  emptyIcon: {
    fontSize: "48px",
    color: "#fbbf24",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#c9d1d9",
    margin: "0 0 8px 0",
  },
  emptySubtext: {
    fontSize: "14px",
    color: "#8b949e",
    margin: 0,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #30363d",
    borderTop: "4px solid #58a6ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#8b949e",
    margin: 0,
    fontWeight: "500",
  },
};

export default StarredRepos;
