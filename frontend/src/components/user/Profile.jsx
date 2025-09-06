import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import "./Profile.css";
import { useAuth } from "../../authContext";
import { UnderlineNav } from "@primer/react"; // example import, adjust as needed
import { BookIcon, RepoIcon } from "@primer/octicons-react";
const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "Username" });
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };

    const fetchRepositories = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3000/repo/user/${userId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setRepositories(data.repositories || data || []);
        } catch (err) {
          console.error("Error while fetching repositories: ", err);
          setError("Failed to load repositories");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
    fetchRepositories();
  }, []);

  return (
    <>
      <Navbar />
    <div className="underline-nav">
  <UnderlineNav aria-label="Repository">
  
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      
  </UnderlineNav>
</div>  

      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <div className="profile-sidebar">
          <div className="profile-image">
            <img src="https://avatars.githubusercontent.com/u/583231?v=4" alt="Profile" />
          </div>
          <h2 className="username">{userDetails.username}</h2>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        {/* RIGHT SECTION */}
        <div className="profile-main">
          {/* USER REPOS */}
          <div className="popular-repos">
            <h3>User Repositories</h3>

            {loading && <p>Loading repositories...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="repos-grid">
              {repositories.length > 0 ? (
                repositories.map((repo) => (
                  <div
                    className="repo-card"
                    key={repo._id}
                    onClick={() => navigate(`/repository/${repo._id}`)}
                  >
                    <h4 className="repo-title">{repo.name}</h4>
                    <p className="repo-description">
                      {repo.description || "No description provided"}
                    </p>
                    <span className="repo-language">
                      {repo.language || "Unknown"}
                    </span>
                  </div>
                ))
              ) : (
                !loading && <p>No repositories found.</p>
              )}
            </div>
          </div>

          {/* HEATMAP */}
          <div className="heatmap-wrapper">
            <h3>Contribution activity</h3>
            <HeatMapProfile />
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
