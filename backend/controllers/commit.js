const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(user, repoName, msg) {
  if (!user || !repoName) {
    console.error("Commit failed: user or repoName is undefined");
    return;
  }

  const repoPath = path.resolve(process.cwd(), ".github_clone");
  const userFolder = path.join(repoPath, user);
  const repofolder = path.join(userFolder, repoName);
  const stagingPath = path.join(repofolder, "staging");
  const commitsPath = path.join(repofolder, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitsPath, commitId);

    await fs.mkdir(commitDir, { recursive: true });

    // Ensure staging exists
    const files = await fs.readdir(stagingPath);

    for (const file of files) {
      const src = path.join(stagingPath, file);
      const dest = path.join(commitDir, file);
      await fs.copyFile(src, dest);
      await fs.unlink(src); // clear staging after commit
    }

    const commitMeta = {
      id: commitId,
      message: msg,
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(commitMeta, null, 2)
    );

    console.log(
      `Commit successful for ${user}/${repoName} with ID: ${commitId} and message: "${msg}"`
    );
  } catch (error) {
    console.error("Error committing changes:", error);
  }
}

module.exports = { commitRepo };