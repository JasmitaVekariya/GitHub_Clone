import React, { useState } from "react";
import axios from "axios";

const FileUploadCommit = ({ repoId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [commitFiles, setCommitFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Step 1: select files
  const handleFileSelect = (e) => {
    setSelectedFiles([...selectedFiles, ...e.target.files]);
  };

  // Step 2: move to commit box
  const handleAddToCommit = () => {
    setCommitFiles([...commitFiles, ...selectedFiles]);
    setSelectedFiles([]);
  };

  // Step 3: push files to server
  const handlePush = async () => {
    if (!commitFiles.length) return;
    const formData = new FormData();
    commitFiles.forEach((file) => formData.append("files", file));
    formData.append("repoId", repoId);

    try {
      setUploading(true);
      const res = await api.post("/repo/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files pushed successfully!");
      setCommitFiles([]);
    } catch (err) {
      console.error(err);
      alert("Failed to push files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      {/* Box 1: Add Files */}
      <div style={styles.box}>
        <h3>Add Files</h3>
        <input type="file" multiple onChange={handleFileSelect} />
        {selectedFiles.length > 0 && (
          <div>
            <ul>
              {selectedFiles.map((f, idx) => (
                <li key={idx}>{f.name}</li>
              ))}
            </ul>
            <button onClick={handleAddToCommit}>Add to Commit</button>
          </div>
        )}
      </div>

      {/* Box 2: Commit Box */}
      <div style={styles.box}>
        <h3>Commit Box</h3>
        {commitFiles.length === 0 && <p>No files to commit</p>}
        {commitFiles.length > 0 && (
          <div>
            <ul>
              {commitFiles.map((f, idx) => (
                <li key={idx}>{f.name}</li>
              ))}
            </ul>
            <button onClick={handlePush} disabled={uploading}>
              {uploading ? "Pushing..." : "Push to Repo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  box: {
    flex: 1,
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#161b22",
    color: "#c9d1d9",
  },
};

export default FileUploadCommit;