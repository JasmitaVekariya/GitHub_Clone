import React, { useState } from "react";
import axios from "axios";

const FileUploadCommit = ({ user, repo }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [commitFiles, setCommitFiles] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:3000",
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

  // Step 3: Commit + Push
  const handleCommitAndPush = async () => {
    if (!commitFiles.length || !commitMsg) {
      alert("Please add files and enter a commit message");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload actual files into staging
      const formData = new FormData();
      commitFiles.forEach((file) => {
        formData.append("files", file);
      });

      await api.post(`/repo/${user}/${repo}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Commit staged files
      await api.post(`/repo/${user}/${repo}/commit`, { message: commitMsg });

      // 3. Push to S3
      await api.post(`/repo/${user}/${repo}/push`);

      alert("Files committed and pushed successfully!");
      setCommitFiles([]);
      setCommitMsg("");
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
            <textarea
              placeholder="Enter commit message"
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              style={{ width: "100%", height: "60px", marginTop: "10px" }}
            />
            <button onClick={handleCommitAndPush} disabled={uploading}>
              {uploading ? "Pushing..." : "Commit & Push"}
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