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
  const repoFolder = path.join(userFolder, repoName);
  const stagingPath = path.join(repoFolder, "staging");
  const commitsPath = path.join(repoFolder, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitsPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    // Copy all files from the latest previous commit
    const commitDirs = await fs.readdir(commitsPath);
    const prevCommits = commitDirs.filter(dir => dir !== commitId);
    if (prevCommits.length > 0) {
      // Sort to find latest commit by modification time
      const commitsWithStats = await Promise.all(
        prevCommits.map(async (dir) => {
          const fullPath = path.join(commitsPath, dir);
          const stats = await fs.stat(fullPath);
          return { dir, mtime: stats.mtime };
        })
      );
      commitsWithStats.sort((a, b) => b.mtime - a.mtime);
      const latestCommit = commitsWithStats[0].dir;

      const latestPath = path.join(commitsPath, latestCommit);
      const prevFiles = await fs.readdir(latestPath);

      for (const file of prevFiles) {
        if (file === "commit.json" || file === "message.txt") continue;
        const src = path.join(latestPath, file);
        const dest = path.join(commitDir, file);
        await fs.copyFile(src, dest);
      }
    }

    // Copy staged files (overwrite if exists)
    const stagedFiles = await fs.readdir(stagingPath);
    for (const file of stagedFiles) {
      const src = path.join(stagingPath, file);
      const dest = path.join(commitDir, file);
      await fs.copyFile(src, dest);
      await fs.unlink(src); // clear staging
    }

    // Save commit metadata
    const commitMeta = {
      id: commitId,
      message: msg,
      timestamp: new Date().toISOString(),
    };
    await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify(commitMeta, null, 2));
    await fs.writeFile(path.join(commitDir, "message.txt"), msg);

    console.log(`✅ Commit successful for ${user}/${repoName}`);
    console.log(`→ ID: ${commitId}`);
    console.log(`→ Message: "${msg}"`);
  } catch (error) {
    console.error("❌ Error committing changes:", error);
  }
}

module.exports = { commitRepo };