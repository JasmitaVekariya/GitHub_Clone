const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function pullRepo(repoName) {
  const repoPath = path.resolve(process.cwd(), ".github_clone", repoName);
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 1. List all objects for this repo only
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: `${repoName}/commits/` })
      .promise();

    if (!data.Contents || data.Contents.length === 0) {
      console.log(`⚠️ No commits found for repo "${repoName}" in S3`);
      return;
    }

    // 2. Iterate over all objects (files) in this repo's commits
    for (const object of data.Contents) {
      const key = object.Key; // e.g. myrepo/commits/123456/file.txt
      const relativePath = key.replace(`${repoName}/`, ""); 
      const localPath = path.join(repoPath, relativePath);

      // Ensure directory exists before writing
      await fs.mkdir(path.dirname(localPath), { recursive: true });

      // Skip "folders" (S3 stores empty keys for dirs sometimes)
      if (key.endsWith("/")) continue;

      // Download file from S3
      const params = { Bucket: S3_BUCKET, Key: key };
      const fileContent = await s3.getObject(params).promise();

      // Write file locally
      await fs.writeFile(localPath, fileContent.Body);

      console.log(`Pulled ${key} → ${localPath}`);
    }
  } catch (error) {
    console.error("Error pulling repository:", error);
  }
}

module.exports = { pullRepo };