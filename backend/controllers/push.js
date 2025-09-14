const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function pushRepo(user, repoName) {
  const rootPath = path.resolve(process.cwd(), ".github_clone");
  const userFolder = path.join(rootPath, user);
  const repoPath = path.join(userFolder, repoName);
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        // S3 Key with user + repo included
        const params = {
          Bucket: S3_BUCKET,
          Key: `${user}/${repoName}/commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        await s3.upload(params).promise();
      }

      console.log(
        `Pushed commit ${commitDir} of repo '${repoName}' for user '${user}' to S3 bucket ${S3_BUCKET}`
      );
    }
  } catch (error) {
    console.error("Error pushing repository:", error);
  }
}

module.exports = { pushRepo };