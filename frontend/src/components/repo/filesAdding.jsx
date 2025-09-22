import React, { useState } from "react";
import axios from "axios";

const FileUploadCommit = ({ user, repo, onCommitSuccess }) => {
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
      
      // Notify parent component to refresh commits
      if (onCommitSuccess) {
        onCommitSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to push files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Box 1: Add Files */}
      <div style={styles.box}>
        <div style={styles.boxHeader}>
          <h3 style={styles.boxTitle}>📁 Add Files</h3>
          <p style={styles.boxSubtitle}>Select files to add to your repository</p>
        </div>
        
        <div style={styles.fileInputContainer}>
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect}
            style={styles.fileInput}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={styles.fileInputLabel}>
            <span style={styles.uploadIcon}>📤</span>
            Choose Files
          </label>
        </div>
        
        {selectedFiles.length > 0 && (
          <div style={styles.selectedFilesContainer}>
            <h4 style={styles.selectedFilesTitle}>Selected Files:</h4>
            <div style={styles.filesList}>
              {selectedFiles.map((f, idx) => (
                <div key={idx} style={styles.fileItem}>
                  <span style={styles.fileIcon}>📄</span>
                  <span style={styles.fileName}>{f.name}</span>
                </div>
              ))}
            </div>
            <button onClick={handleAddToCommit} style={styles.addButton}>
              ➕ Add to Commit
            </button>
          </div>
        )}
      </div>

      {/* Box 2: Commit Box */}
      <div style={styles.box}>
        <div style={styles.boxHeader}>
          <h3 style={styles.boxTitle}>💾 Commit Box</h3>
          <p style={styles.boxSubtitle}>Review and commit your changes</p>
        </div>
        
        {commitFiles.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p style={styles.emptyText}>No files to commit</p>
            <p style={styles.emptySubtext}>Add some files first to get started</p>
          </div>
        ) : (
          <div style={styles.commitContainer}>
            <div style={styles.commitFilesList}>
              <h4 style={styles.commitFilesTitle}>Files to commit:</h4>
              <div style={styles.filesList}>
                {commitFiles.map((f, idx) => (
                  <div key={idx} style={styles.fileItem}>
                    <span style={styles.fileIcon}>📄</span>
                    <span style={styles.fileName}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.messageContainer}>
              <label style={styles.messageLabel}>Commit Message:</label>
              <textarea
                placeholder="Enter a descriptive commit message..."
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                style={styles.messageInput}
              />
            </div>
            
            <button 
              onClick={handleCommitAndPush} 
              disabled={uploading}
              style={uploading ? styles.pushButtonDisabled : styles.pushButton}
            >
              {uploading ? "⏳ Pushing..." : "🚀 Commit & Push"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "24px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  box: {
    flex: 1,
    minWidth: "300px",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "28px",
    backgroundColor: "#161b22",
    boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  boxHeader: {
    marginBottom: "24px",
    textAlign: "center",
  },
  boxTitle: {
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "#c9d1d9",
  },
  boxSubtitle: {
    fontSize: "16px",
    color: "#8b949e",
    margin: 0,
    fontWeight: "500",
  },
  fileInputContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  fileInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  fileInputLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    border: "2px dashed #30363d",
    borderRadius: "6px",
    backgroundColor: "#21262d",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    fontSize: "16px",
    color: "#8b949e",
  },
  uploadIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  selectedFilesContainer: {
    marginTop: "20px",
  },
  selectedFilesTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#c9d1d9",
    margin: "0 0 16px 0",
  },
  commitFilesTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#c9d1d9",
    margin: "0 0 16px 0",
  },
  filesList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
  },
  fileIcon: {
    fontSize: "16px",
  },
  fileName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#475569",
  },
  addButton: {
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },
  emptyIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#475569",
  },
  emptySubtext: {
    fontSize: "14px",
    margin: 0,
    color: "#94a3b8",
  },
  commitContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  commitFilesList: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  messageInput: {
    width: "100%",
    minHeight: "80px",
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
  },
  pushButton: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
  },
  pushButtonDisabled: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#8b949e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "not-allowed",
    opacity: 0.6,
  },
};

export default FileUploadCommit;