const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(repoName, msg) {
  const repoPath = path.resolve(process.cwd(), ".github_clone");
  const repofolder = path.join(repoPath , repoName);
  const stagingPath = path.join(repofolder, "staging");
  const commitsPath = path.join(repofolder, "commits");

  try{
    const commitId = uuidv4(); // Generate a unique commit ID
    const commitDir = path.join(commitsPath, commitId);

    await fs.mkdir(commitDir, { recursive: true });

    // Read all files from the staging area
    const files = await fs.readdir(stagingPath);

    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitDir, file)
      );
    }

    await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({
      id: commitId,
      message: msg,
      timestamp: new Date().toISOString()
    }));

    console.log(`Commit successful with ID: ${commitId} and message: "${msg}"`);

  }catch (error) {
    console.error("Error committing changes:", error);
    return;
  }

}

module.exports = { commitRepo };

