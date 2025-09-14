const fs = require("fs").promises; // file system 
const path = require("path");

async function initRepo(user, repoName) {
  // Root directory for .github_clone
  const rootPath = path.resolve(process.cwd(), ".github_clone");  

  // User folder inside .github_clone
  const userFolder = path.join(rootPath, user);

  // Repo folder inside user's folder
  const repoFolder = path.join(userFolder, repoName);

  // Commits folder inside repo
  const commitsPath = path.join(repoFolder, "commits");

  try {
    // Make sure all required folders exist
    await fs.mkdir(rootPath, { recursive: true });
    await fs.mkdir(userFolder, { recursive: true });
    await fs.mkdir(repoFolder, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    // Create a config.json for this repo
    await fs.writeFile(
      path.join(repoFolder, "config.json"),
      JSON.stringify({ bucket: process.env.S3_Bucket }, null, 2)
    );

    console.log(`Repo '${repoName}' created for user '${user}'`);
  } catch (err) {
    console.error("Error Initialising repository", err);
  }
}

module.exports = { initRepo };