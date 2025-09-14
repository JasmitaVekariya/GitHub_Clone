const fs = require("fs").promises;
const path = require("path");

async function addRepo(user, repoName, filepath) {
  // Root path for .github_clone
  const rootPath = path.resolve(process.cwd(), ".github_clone");

  // User-specific folder
  const userFolder = path.join(rootPath, user);

  // Repo folder for this user
  const repoFolder = path.join(userFolder, repoName);

  // Staging area inside repo
  const stagingPath = path.join(repoFolder, "staging");

  try {
    // Ensure the staging directory exists
    await fs.mkdir(stagingPath, { recursive: true });

    // Get filename from given file path
    const fileName = path.basename(filepath);

    // Copy file into staging area
    await fs.copyFile(filepath, path.join(stagingPath, fileName));

    console.log(`File ${fileName} added to staging area of repo '${repoName}' for user '${user}'.`);
  } catch (error) {
    console.error("Error adding file:", error);
  }
}

module.exports = { addRepo };