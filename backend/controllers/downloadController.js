const archiver = require('archiver');
const { s3, S3_BUCKET } = require('../config/aws-config.js');
const fs = require('fs').promises;
const path = require('path');

// Download latest commit files as ZIP
async function downloadLatestCommitAsZip(req, res) {
  const { user, repo } = req.params;
  
  console.log(`Download request for user: ${user}, repo: ${repo}`);
  
  try {
    // First, find the latest commit directory
    const commitsPrefix = `${user}/${repo}/commits/`;
    
    // List all commit directories
    const commitsResponse = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: commitsPrefix,
      Delimiter: '/'
    }).promise();

    if (!commitsResponse.CommonPrefixes || commitsResponse.CommonPrefixes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No commits found for this repository" 
      });
    }

    // Extract commit IDs and find the latest one (highest timestamp)
    const commitIds = commitsResponse.CommonPrefixes
      .map(prefix => prefix.Prefix.replace(commitsPrefix, '').replace('/', ''))
      .filter(id => id && !isNaN(Number(id)))
      .sort((a, b) => Number(b) - Number(a)); // Sort descending to get latest first

    if (commitIds.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No valid commits found" 
      });
    }

    const latestCommitId = commitIds[0];
    const latestCommitKey = `${commitsPrefix}${latestCommitId}/`;
    
    // List all objects in the latest commit directory
    const listResponse = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: latestCommitKey,
    }).promise();

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No files found in latest commit" 
      });
    }

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo}-latest-commit-${latestCommitId}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ 
        success: false, 
        message: "Error creating ZIP file" 
      });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add files to ZIP
    for (const obj of listResponse.Contents) {
      if (obj.Key.endsWith('/')) continue; // Skip directories
      
      try {
        // Get file from S3
        const fileResponse = await s3.getObject({
          Bucket: S3_BUCKET,
          Key: obj.Key
        }).promise();

        // Extract relative path from S3 key
        const relativePath = obj.Key.replace(latestCommitKey, '');
        
        // Add file to ZIP
        archive.append(fileResponse.Body, { name: relativePath });
      } catch (fileErr) {
        console.error(`Error processing file ${obj.Key}:`, fileErr);
        // Continue with other files even if one fails
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Error downloading commit as ZIP:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

// Download specific commit files as ZIP
async function downloadCommitAsZip(req, res) {
  const { user, repo, commitId } = req.params;
  
  try {
    // Get the specific commit files from S3
    const commitKey = `${user}/${repo}/commits/${commitId}/`;
    
    // List all objects in the commit directory
    const listResponse = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: commitKey,
    }).promise();

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No files found in this commit" 
      });
    }

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo}-commit-${commitId}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ 
        success: false, 
        message: "Error creating ZIP file" 
      });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add files to ZIP
    for (const obj of listResponse.Contents) {
      if (obj.Key.endsWith('/')) continue; // Skip directories
      
      try {
        // Get file from S3
        const fileResponse = await s3.getObject({
          Bucket: S3_BUCKET,
          Key: obj.Key
        }).promise();

        // Extract relative path from S3 key
        const relativePath = obj.Key.replace(commitKey, '');
        
        // Add file to ZIP
        archive.append(fileResponse.Body, { name: relativePath });
      } catch (fileErr) {
        console.error(`Error processing file ${obj.Key}:`, fileErr);
        // Continue with other files even if one fails
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Error downloading commit as ZIP:', error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}


module.exports = {
  downloadLatestCommitAsZip,
  downloadCommitAsZip
};
