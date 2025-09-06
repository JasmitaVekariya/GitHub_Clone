import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const styles = {
  appWrapper: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    color: "#c9d1d9",
  },
  dashboard: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "20px",
    padding: "20px",
    width: "80%",
    maxWidth: "1200px",
    background: "#0d1117",
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "12px",
    margin: "10px 0",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cardHover: {
    background: "#1f2731",
  },
  cardTitle: {
    margin: 0,
    color: "#58a6ff",
    fontSize: "16px",
  },
  cardDesc: {
    margin: "5px 0 0",
    color: "#8b949e",
    fontSize: "14px",
  },
  heading: {
    borderBottom: "1px solid #30363d",
    paddingBottom: "6px",
    marginBottom: "10px",
  },
  searchBox: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "#c9d1d9",
    fontSize: "14px",
  },
  sidebar: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "15px",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "#f85149",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  noResults: {
    textAlign: "center",
    color: "#8b949e",
    padding: "10px",
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
        console.error("Error while fetching repositories: ", err);
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
        console.error("Error while fetching suggested repositories: ", err);
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

return (
  <>
    {/* Navbar stays completely independent */}
    <Navbar />

    {/* Page content wrapper */}
    <div
  style={{
    ...styles.appWrapper,
    display: "block",
    justifyContent: "unset",
    alignItems: "unset",
    paddingTop: "80px", // 🔥 Add this line
  }}
>

      <section id="dashboard" style={styles.dashboard}>
        {/* Suggested Repos */}
        <aside style={styles.sidebar}>
          <h3 style={styles.heading}>Suggested Repositories</h3>
          {suggestedRepositories.length > 0 ? (
            suggestedRepositories.map((repo) => (
              <div style={styles.card} key={repo._id}>
                <h4 style={styles.cardTitle}>{repo?.name}</h4>
                <p style={styles.cardDesc}>{repo?.description}</p>
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No suggestions available.</p>
          )}
        </aside>

        {/* User Repos */}
        <main>
          <h2 style={styles.heading}>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBox}
            />
          </div>

          {searchResults.length > 0 ? (
            searchResults.map((repo) => (
              <div
                style={styles.card}
                key={repo._id}
                onClick={() => navigate(`/repository/${repo._id}`)}
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

        {/* Events */}
        <aside style={styles.sidebar}>
          <h3 style={styles.heading}>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  </>
);
};

export default Dashboard;
