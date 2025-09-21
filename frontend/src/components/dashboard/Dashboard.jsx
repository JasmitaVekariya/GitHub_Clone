import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiStar, FiEye, FiCode, FiCalendar, FiTrendingUp } from "react-icons/fi";
import Navbar from "../Navbar";

const palette = {
  bg: "#f8fafc",
  card: "rgba(255, 255, 255, 0.95)",
  border: "#e2e8f0",
  accent: "#667eea",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const styles = {
  appWrapper: {
    background: palette.gradient,
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: palette.textPrimary,
  },
  dashboard: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1fr",
    gap: "32px",
    padding: "120px 24px 80px",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sidebar: {
    background: palette.card,
    backdropFilter: "blur(20px)",
    border: `2px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: "24px",
    padding: "32px 24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "24px 20px",
    marginBottom: "16px",
    cursor: "pointer",
    boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  cardHover: {
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 15px 35px -5px rgba(102, 126, 234, 0.3)",
    transform: "translateY(-2px)",
  },
  cardTitle: {
    margin: 0,
    background: palette.gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  cardDesc: {
    margin: "8px 0 0",
    color: palette.textSecondary,
    fontSize: "0.9rem",
    lineHeight: "1.5",
    minHeight: "40px",
  },
  ownerText: {
    fontSize: "0.8rem",
    color: palette.textSecondary,
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "500",
  },
  heading: {
    borderBottom: `2px solid ${palette.border}`,
    paddingBottom: "16px",
    marginBottom: "24px",
    fontSize: "1.5rem",
    fontWeight: "800",
    background: palette.gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  searchWrapper: {
    position: "relative",
    marginBottom: "24px",
  },
  searchBox: {
    width: "100%",
    padding: "16px 20px 16px 48px",
    borderRadius: "16px",
    border: `2px solid ${palette.border}`,
    background: "rgba(255, 255, 255, 0.9)",
    color: palette.textPrimary,
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    fontWeight: "500",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "16px",
    transform: "translateY(-50%)",
    color: palette.accent,
    fontSize: "18px",
  },
  noResults: {
    textAlign: "center",
    color: palette.textSecondary,
    padding: "32px 20px",
    fontSize: "16px",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "60px 40px",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: palette.textPrimary,
  },
  error: {
    textAlign: "center",
    padding: "60px 40px",
    color: "#dc2626",
    fontSize: "1.3rem",
    fontWeight: "600",
    backgroundColor: "#fef2f2",
    borderRadius: "16px",
    border: "2px solid #fecaca",
  },
  statsCard: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statsIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: palette.gradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  statsText: {
    fontSize: "14px",
    fontWeight: "600",
    color: palette.textPrimary,
  },
};

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Fetch user's own repos
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRepositories(data.repositories ?? data ?? []);
      } catch (err) {
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    // Fetch suggested repos
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const filteredRepos = (data ?? []).filter((repo) => {
          const ownerId = repo.ownerId || (repo.owner && repo.owner._id);
          return (
            ownerId &&
            String(ownerId) !== String(userId) &&
            repo.visibility === true
          );
        });

        setSuggestedRepositories(filteredRepos);
      } catch (err) {
        setError("Failed to load suggested repositories");
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  // Filter repos only when searching
  const filteredUserRepos =
    searchQuery.length > 0
      ? repositories.filter((repo) =>
          repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  if (loading) {
    return (
      <div style={styles.appWrapper}>
        <div style={styles.loading}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.appWrapper}>
        <div style={styles.error}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  // Hover helpers
  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = styles.cardHover.background;
    e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = palette.card;
    e.currentTarget.style.boxShadow = styles.card.boxShadow;
  };

  return (
    <>
      <Navbar />
      <div style={styles.appWrapper}>
        <section id="dashboard" style={styles.dashboard}>
          {/* Stats & Quick Actions */}
          <aside style={styles.sidebar}>
            <h3 style={styles.heading}>📊 Quick Stats</h3>
            <div style={styles.statsCard}>
              <div style={styles.statsIcon}>
                <FiCode size={20} />
              </div>
              <div>
                <div style={styles.statsText}>Your Repositories</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: palette.accent }}>
                  {repositories.length}
                </div>
              </div>
            </div>
            <div style={styles.statsCard}>
              <div style={styles.statsIcon}>
                <FiStar size={20} />
              </div>
              <div>
                <div style={styles.statsText}>Total Stars</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: palette.accent }}>
                  {repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0)}
                </div>
              </div>
            </div>
            <div style={styles.statsCard}>
              <div style={styles.statsIcon}>
                <FiEye size={20} />
              </div>
              <div>
                <div style={styles.statsText}>Total Views</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: palette.accent }}>
                  {repositories.reduce((sum, repo) => sum + (repo.views || 0), 0)}
                </div>
              </div>
            </div>
          </aside>

          {/* User Repositories with Search */}
          <main style={styles.sidebar}>
            <h2 style={styles.heading}>🚀 Your Repositories</h2>
            <div style={styles.searchWrapper}>
              <FiSearch style={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search your repositories..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchBox}
                onFocus={(e) => (e.target.style.borderColor = palette.accent)}
                onBlur={(e) => (e.target.style.borderColor = palette.border)}
              />
            </div>
            {searchQuery.length > 0 ? (
              filteredUserRepos.length > 0 ? (
                filteredUserRepos.map((repo) => (
                  <div
                    style={styles.card}
                    key={repo._id}
                    onClick={() => navigate(`/repository/${repo._id}`)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <h4 style={styles.cardTitle}>{repo?.name}</h4>
                    <p style={styles.cardDesc}>
                      {repo?.description || "No description provided"}
                    </p>
                    <p style={styles.ownerText}>
                      <FiUser /> {repo?.owner?.username || "You"}
                    </p>
                  </div>
                ))
              ) : (
                <p style={styles.noResults}>No repositories found matching your search.</p>
              )
            ) : (
              repositories.length > 0 ? (
                repositories.map((repo) => (
                  <div
                    style={styles.card}
                    key={repo._id}
                    onClick={() => navigate(`/repository/${repo._id}`)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <h4 style={styles.cardTitle}>{repo?.name}</h4>
                    <p style={styles.cardDesc}>
                      {repo?.description || "No description provided"}
                    </p>
                    <p style={styles.ownerText}>
                      <FiUser /> {repo?.owner?.username || "You"}
                    </p>
                  </div>
                ))
              ) : (
                <p style={styles.noResults}>
                  <FiCode /> No repositories yet. Create your first one!
                </p>
              )
            )}
          </main>

          {/* Suggested Repositories & Events */}
          <aside style={styles.sidebar}>
            <h3 style={styles.heading}>🌟 Discover</h3>
            {suggestedRepositories.length > 0 ? (
              suggestedRepositories.slice(0, 3).map((repo) => (
                <div
                  style={styles.card}
                  key={repo._id}
                  onClick={() => navigate(`/repository/${repo._id}`)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <h4 style={styles.cardTitle}>{repo?.name}</h4>
                  <p style={styles.cardDesc}>
                    {repo?.description || "No description provided"}
                  </p>
                  <p style={styles.ownerText}>
                    <FiUser /> {repo?.owner?.username || "Unknown"}
                  </p>
                </div>
              ))
            ) : (
              <p style={styles.noResults}>No suggestions available.</p>
            )}
            
            <h3 style={{...styles.heading, marginTop: "32px"}}>📅 Recent Activity</h3>
            <div
              style={styles.card}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h4 style={styles.cardTitle}>Welcome to CodeVault!</h4>
              <p style={styles.cardDesc}>
                Start by creating your first repository or exploring public ones.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
