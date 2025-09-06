import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const palette = {
  bg: "#0a0e14",
  card: "#141c26",
  border: "#30363d",
  accent: "#58a6ff",
  textPrimary: "#c9d1d9",
  textSecondary: "#768390",
};

const styles = {
  appWrapper: {
    backgroundColor: palette.bg,
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    color: palette.textPrimary,
  },
  dashboard: {
    display: "grid",
    gridTemplateColumns: "1.3fr 2fr 1.3fr",
    gap: "20px",
    padding: "40px 20px 80px",
    width: "90%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sidebar: {
    background: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: "12px",
    padding: "24px 20px",
    boxShadow: "0 2px 12px rgb(20 23 26 / 0.5)",
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: palette.card,
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgb(20 23 26 / 0.6)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
  },
  cardHover: {
    background: "#1b2330",
    boxShadow: "0 4px 20px rgb(56 139 253 / 0.4)",
  },
  cardTitle: {
    margin: 0,
    color: palette.accent,
    fontSize: "1rem",
    fontWeight: "600",
  },
  cardDesc: {
    margin: "6px 0 0",
    color: palette.textSecondary,
    fontSize: "0.85rem",
    lineHeight: "1.3",
    minHeight: "48px",
  },
  heading: {
    borderBottom: `1px solid ${palette.border}`,
    paddingBottom: "8px",
    marginBottom: "20px",
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  searchBox: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: `1px solid ${palette.border}`,
    background: "#0d1117",
    color: palette.textPrimary,
    fontSize: "14px",
    marginBottom: "20px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  noResults: {
    textAlign: "center",
    color: palette.textSecondary,
    padding: "20px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.2rem",
  },
  error: {
    textAlign: "center",
    padding: "40px",
    color: "#f85149",
  },
};

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRepositories(data.repositories ?? data ?? []);
      } catch (err) {
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestedRepositories(data ?? []);
      } catch (err) {
        setError("Failed to load suggested repositories");
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

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

  // Helper for hover effect on cards
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
      <div style={{ ...styles.appWrapper, paddingTop: "80px" }}>
        <section id="dashboard" style={styles.dashboard}>
          {/* Suggested Repositories */}
          <aside style={styles.sidebar}>
            <h3 style={styles.heading}>Suggested Repositories</h3>
            {suggestedRepositories.length > 0 ? (
              suggestedRepositories.map((repo) => (
                <div
                  style={styles.card}
                  key={repo._id}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <h4 style={styles.cardTitle}>{repo?.name}</h4>
                  <p style={styles.cardDesc}>
                    {repo?.description || "No description provided"}
                  </p>
                </div>
              ))
            ) : (
              <p style={styles.noResults}>No suggestions available.</p>
            )}
          </aside>

          {/* User Repositories */}
          <main style={styles.sidebar}>
            <h2 style={styles.heading}>Your Repositories</h2>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBox}
              onFocus={(e) => (e.target.style.borderColor = palette.accent)}
              onBlur={(e) => (e.target.style.borderColor = palette.border)}
            />
            {searchResults.length > 0 ? (
              searchResults.map((repo) => (
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
                </div>
              ))
            ) : (
              <p style={styles.noResults}>No repositories found.</p>
            )}
          </main>

          {/* Upcoming Events */}
          <aside style={styles.sidebar}>
            <h3 style={styles.heading}>Upcoming Events</h3>
            <div
              style={styles.card}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h4 style={styles.cardTitle}>Community Standup</h4>
              <p style={styles.cardDesc}>Mon, Oct 26, 2024 - Virtual Event</p>
            </div>
            <div
              style={styles.card}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h4 style={styles.cardTitle}>Open Source Sprint</h4>
              <p style={styles.cardDesc}>
                Wed, Oct 28, 2024 - Codebase Contribution
              </p>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
