const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require('../config/aws-config.js');

async function pushRepo(repoName) {
  const repoPath = path.resolve(process.cwd(), '.github_clone', repoName);
  const commitsPath = path.join(repoPath, 'commits');

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        // 🔑 Change: Include repoName in the S3 Key
        const params = {
          Bucket: S3_BUCKET,
          Key: `${repoName}/commits/${commitDir}/${file}`, 
          Body: fileContent,
        };

        await s3.upload(params).promise();
      }

      console.log(`Pushed commit ${commitDir} of repo ${repoName} to S3 bucket ${S3_BUCKET}`);
    }
  } catch (error) {
    console.error('Error pushing repository:', error);
  }
}

module.exports = { pushRepo };