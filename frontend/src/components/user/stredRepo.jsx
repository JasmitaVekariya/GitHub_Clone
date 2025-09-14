import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";

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
      <div className="underline-nav">
        <UnderlineNav aria-label="Repository">
          <UnderlineNav.Item
            onClick={() => navigate("/profile")}
            icon={BookIcon}
            sx={{
              backgroundColor: "transparent",
              color: "white",
              "&:hover": { textDecoration: "underline", color: "white" },
            }}
          >
            Overview
          </UnderlineNav.Item>
          <UnderlineNav.Item
            aria-current="page"
            onClick={() => navigate("/profile/starred")}
            icon={RepoIcon}
            sx={{
              backgroundColor: "transparent",
              color: "whitesmoke",
              "&:hover": { textDecoration: "underline", color: "white" },
            }}
          >
            Starred Repositories
          </UnderlineNav.Item>
        </UnderlineNav>
      </div>

      <div className="repos-grid">
        {loading ? (
          <p>Loading starred repositories...</p>
        ) : repos.length > 0 ? (
          repos.map((repo) => (
            <div
              className="repo-card"
              key={repo._id}
              onClick={() => navigate(`/repository/${repo._id}`)}
            >
              <h4>{repo.name}</h4>
              <p>{repo.description || "No description"}</p>
            </div>
          ))
        ) : (
          <p>No starred repositories.</p>
        )}
      </div>
    </>
  );
};

export default StarredRepos;
