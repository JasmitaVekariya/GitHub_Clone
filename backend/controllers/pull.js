const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".github_clone");
  const commitspath = path.join(repoPath, "commits");

  try {
    
    const data = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: 'commits/' }).promise();

    const objects = data.Contents ;

    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(commitspath, path.dirname(key).split("/").pop()); // Extract commit directory from the key
      await fs.mkdir(commitDir, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key
      };

      const fileContent = await s3.getObject(params).promise();
      const filePath = path.join(repoPath, key);
      await fs.writeFile(filePath, fileContent.Body);

      console.log(`Pulled ${key} to ${filePath}`);
    }
  } catch (error) {
    console.error("Error pulling repository:", error);
  }
}
module.exports = { pullRepo };
