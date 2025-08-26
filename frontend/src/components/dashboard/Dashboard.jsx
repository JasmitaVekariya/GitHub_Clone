import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setRepositories(data.repositories || []);
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
        setSuggestedRepositories(data || []);
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
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "20px" }}>
        <aside style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.length > 0 ? (
            suggestedRepositories.map((repo) => (
              <div key={repo._id} style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{repo.name}</h4>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>{repo.description}</p>
              </div>
            ))
          ) : (
            <p>No suggested repositories available</p>
          )}
        </aside>

        <main style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h2>Your Repositories</h2>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "5px", 
                border: "1px solid #ddd",
                fontSize: "16px"
              }}
            />
          </div>
          
          {searchResults.length > 0 ? (
            searchResults.map((repo) => (
              <div key={repo._id} style={{ marginBottom: "15px", padding: "15px", background: "white", borderRadius: "5px", border: "1px solid #eee" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{repo.name}</h4>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>{repo.description}</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>{searchQuery ? "No repositories found matching your search." : "No repositories available."}</p>
            </div>
          )}
        </main>

        <aside style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h3>Upcoming Events</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
              <p style={{ margin: "0", fontWeight: "bold" }}>Tech Conference</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>Dec 15</p>
            </li>
            <li style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
              <p style={{ margin: "0", fontWeight: "bold" }}>Developer Meetup</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>Dec 25</p>
            </li>
            <li style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
              <p style={{ margin: "0", fontWeight: "bold" }}>React Summit</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>Jan 5</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;