const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(user, repoName, commitId) {
  const rootPath = path.resolve(process.cwd(), ".github_clone");
  const userFolder = path.join(rootPath, user);
  const repoPath = path.join(userFolder, repoName);
  const commitsPath = path.join(repoPath, "commits", String(commitId));

  try {
    // Read all files from the target commit folder
    const files = await readdir(commitsPath);

    // Destination = repo root (inside .github_clone/<user>/<repoName>)
    const parentDir = repoPath;

    for (const file of files) {
      if (file === "commit.json") continue; // skip metadata file
      await copyFile(
        path.join(commitsPath, file),
        path.join(parentDir, file)
      );
    }

    console.log(
      `Reverted repo "${repoName}" for user "${user}" to commit ${commitId} successfully.`
    );
  } catch (error) {
    console.error("Unable to revert:", error);
  }
}

module.exports = { revertRepo };