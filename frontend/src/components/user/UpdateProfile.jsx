import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FaUser, FaImage, FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const UpdateProfile = () => {
  const { id } = useParams(); // userId from route params
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");

  // Load existing user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/userProfile/${id}`);
        setBio(res.data.bio || "");
        setProfilePicture(res.data.profilePicture || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:3000/updateuser/${id}`, {
      bio,
      profilePicture,
    });

    setMessage("Profile updated successfully ✅");
    setTimeout(() => navigate(`/profile/${id}`), 1200);
  } catch (err) {
    console.error("Error updating user:", err);
    setMessage("Failed to update profile ❌");
  }
};


  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <FaEdit size={32} />
            </div>
            <h1 style={styles.title}>Update Profile</h1>
            <p style={styles.subtitle}>Edit your personal information and profile picture</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={styles.textarea}
                placeholder="Write something about yourself..."
                rows="4"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FaImage style={styles.labelIcon} />
                Profile Picture URL
              </label>
              <input
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                style={styles.input}
                placeholder="Enter image URL"
              />
            </div>

            {profilePicture && (
              <div style={styles.previewContainer}>
                <div style={styles.previewLabel}>Preview:</div>
                <img
                  src={profilePicture}
                  alt="Profile Preview"
                  style={styles.previewImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={styles.imageError} style={{ display: 'none' }}>
                  Invalid image URL
                </div>
              </div>
            )}

            <button type="submit" style={styles.submitButton}>
              <FaEdit style={{ marginRight: "8px" }} />
              Update Profile
            </button>
          </form>

          {message && (
            <div style={message.includes("Failed") ? styles.errorMessage : styles.successMessage}>
              {message.includes("Failed") ? (
                <FaExclamationCircle />
              ) : (
                <FaCheckCircle />
              )}
              {message}
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "120px 20px 40px",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  iconContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    margin: "0 auto 24px",
    boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 12px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    margin: 0,
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  labelIcon: {
    color: "#667eea",
    fontSize: "16px",
  },
  input: {
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  textarea: {
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  previewLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
  },
  previewImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.2)",
  },
  imageError: {
    fontSize: "14px",
    color: "#dc2626",
    fontWeight: "500",
  },
  submitButton: {
    padding: "20px 32px",
    borderRadius: "16px",
    border: "none",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "20px",
  },
  successMessage: {
    padding: "16px 20px",
    borderRadius: "12px",
    backgroundColor: "#d1fae5",
    color: "#059669",
    border: "1px solid #a7f3d0",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  errorMessage: {
    padding: "16px 20px",
    borderRadius: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

export default UpdateProfile;
