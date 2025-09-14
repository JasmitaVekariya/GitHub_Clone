import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons"; // icon for new repo
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const owner = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3000/repo/create", {
        owner,
        name,
        description,
        content,
        visibility,
      });

      setMessage(response.data.message);
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating repository:", error);
      setMessage("Failed to create repository.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="repo-page">
        <div className="repo-box">
          <h2 className="repo-title">
            <FontAwesomeIcon icon={faFolderPlus} style={{ marginRight: "8px" }} />
            Create a new repository
          </h2>

          <form onSubmit={handleSubmit} className="repo-form">
            {/* General Section */}
            <div className="repo-section">
              <h3 className="repo-subtitle">1. General</h3>
              <label className="repo-label">Repository Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="repo-input"
              />
              <label className="repo-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="repo-textarea"
              />
            </div>

            {/* Content Section */}
            <div className="repo-section">
              <label className="repo-label">Content</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="repo-input"
              />
            </div>

            {/* Configuration Section */}
            <div className="repo-section">
              <h3 className="repo-subtitle">2. Configuration</h3>
              <label className="repo-label">Choose visibility *</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value === "true")}
                className="repo-select"
              >
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>

            <button type="submit" className="repo-button">
              Create Repository
            </button>
          </form>

          {message && (
            <p
              className={`repo-message ${
                message.includes("Failed") ? "error" : "success"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
