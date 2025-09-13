const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(repoName, commitId) {
  const repoPath = path.resolve(process.cwd(), ".github_clone", repoName);
  const commitsPath = path.join(repoPath, "commits", String(commitId));

  try {
    // Read all files from the target commit folder
    const files = await readdir(commitsPath);

    // Destination = repo root (inside .github_clone/<repoName>)
    const parentDir = repoPath;

    for (const file of files) {
      await copyFile(
        path.join(commitsPath, file),
        path.join(parentDir, file)
      );
    }

    console.log(`Reverted repo "${repoName}" to commit ${commitId} successfully.`);
  } catch (error) {
    console.error("Unable to revert:", error);
  }
}

module.exports = { revertRepo };