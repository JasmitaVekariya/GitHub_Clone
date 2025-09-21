const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function pushRepo(user, repoName) {
  const rootPath = path.resolve(process.cwd(), ".github_clone");
  const repoPath = path.join(rootPath, user, repoName);
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    // Sort by timestamp (so latest commit is last)
    commitDirs.sort((a, b) => Number(a) - Number(b));

    // Track all files across all commits to ensure each commit has complete file set
    const allFiles = new Set();
    const commitFiles = new Map(); // commitId -> Set of files

    // First pass: collect all files from all commits
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);
      
      // Filter out metadata files
      const actualFiles = files.filter(file => 
        file !== 'commit.json' && file !== 'message.txt'
      );
      
      commitFiles.set(commitDir, new Set(actualFiles));
      actualFiles.forEach(file => allFiles.add(file));
    }

    // Second pass: ensure each commit has all files (copy missing files from previous commits)
    for (let i = 0; i < commitDirs.length; i++) {
      const commitDir = commitDirs[i];
      const commitPath = path.join(commitsPath, commitDir);
      const currentCommitFiles = commitFiles.get(commitDir);
      
      // Copy missing files from previous commits
      for (const file of allFiles) {
        if (!currentCommitFiles.has(file)) {
          // Find the most recent commit that has this file
          for (let j = i - 1; j >= 0; j--) {
            const prevCommitDir = commitDirs[j];
            const prevCommitFiles = commitFiles.get(prevCommitDir);
            
            if (prevCommitFiles.has(file)) {
              const sourcePath = path.join(commitsPath, prevCommitDir, file);
              const destPath = path.join(commitPath, file);
              
              try {
                await fs.copyFile(sourcePath, destPath);
                currentCommitFiles.add(file);
                console.log(`Copied ${file} from commit ${prevCommitDir} to commit ${commitDir}`);
                break;
              } catch (err) {
                console.warn(`Could not copy ${file} from commit ${prevCommitDir}:`, err.message);
              }
            }
          }
        }
      }
    }

    // Third pass: upload all commits with complete file sets
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      // Upload each file in this commit
      for (const file of files) {
        if (file === 'commit.json' || file === 'message.txt') continue;
        
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const params = {
          Bucket: S3_BUCKET,
          Key: `${user}/${repoName}/commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        await s3.upload(params).promise();
      }

      // Save commit metadata (commit.json)
      const commitMeta = {
        commitId: commitDir,
        timestamp: new Date().toISOString(),
        message: await safeReadFile(path.join(commitPath, "message.txt")),
        author: user,
        files: Array.from(commitFiles.get(commitDir) || [])
      };

      await s3
        .upload({
          Bucket: S3_BUCKET,
          Key: `${user}/${repoName}/commits/${commitDir}/commit.json`,
          Body: JSON.stringify(commitMeta, null, 2),
        })
        .promise();

      console.log(
        `Pushed commit ${commitDir} of repo '${repoName}' for user '${user}' with ${commitFiles.get(commitDir)?.size || 0} files`
      );
    }

    // Update HEAD pointer to latest commit
    const latestCommit = commitDirs[commitDirs.length - 1];
    const headData = {
      branch: "main",
      latestCommit,
    };

    await s3
      .upload({
        Bucket: S3_BUCKET,
        Key: `${user}/${repoName}/HEAD.json`,
        Body: JSON.stringify(headData, null, 2),
      })
      .promise();

    await s3
      .upload({
        Bucket: S3_BUCKET,
        Key: `${user}/${repoName}/refs/heads/main.json`,
        Body: JSON.stringify(headData, null, 2),
      })
      .promise();

    console.log(`Updated HEAD to commit ${latestCommit}`);
  } catch (error) {
    console.error("Error pushing repository:", error);
  }
}

// Helper to safely read optional files
async function safeReadFile(filePath) {
  try {
    return (await fs.readFile(filePath, "utf8")).trim();
  } catch {
    return "";
  }
}

// Get committed files for a repository
async function getCommittedFiles(user, repoName) {
  const rootPath = path.resolve(process.cwd(), ".github_clone");
  const repoPath = path.join(rootPath, user, repoName);
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    
    // Sort by timestamp (so latest commit is last)
    commitDirs.sort((a, b) => Number(a) - Number(b));

    // Track all files across all commits to ensure each commit has complete file set
    const allFiles = new Set();
    const commitFiles = new Map(); // commitId -> Set of files

    // First pass: collect all files from all commits
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);
      
      // Filter out metadata files
      const actualFiles = files.filter(file => 
        file !== 'commit.json' && file !== 'message.txt'
      );
      
      commitFiles.set(commitDir, new Set(actualFiles));
      actualFiles.forEach(file => allFiles.add(file));
    }

    // Second pass: ensure each commit has all files (copy missing files from previous commits)
    for (let i = 0; i < commitDirs.length; i++) {
      const commitDir = commitDirs[i];
      const commitPath = path.join(commitsPath, commitDir);
      const currentCommitFiles = commitFiles.get(commitDir);
      
      // Copy missing files from previous commits
      for (const file of allFiles) {
        if (!currentCommitFiles.has(file)) {
          // Find the most recent commit that has this file
          for (let j = i - 1; j >= 0; j--) {
            const prevCommitDir = commitDirs[j];
            const prevCommitFiles = commitFiles.get(prevCommitDir);
            
            if (prevCommitFiles.has(file)) {
              const sourcePath = path.join(commitsPath, prevCommitDir, file);
              const destPath = path.join(commitPath, file);
              
              try {
                await fs.copyFile(sourcePath, destPath);
                currentCommitFiles.add(file);
                console.log(`Copied ${file} from commit ${prevCommitDir} to commit ${commitDir}`);
                break;
              } catch (err) {
                console.warn(`Could not copy ${file} from commit ${prevCommitDir}:`, err.message);
              }
            }
          }
        }
      }
    }

    const commits = [];

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);

      // Read commit metadata
      let commitMeta = {};
      try {
        const metaContent = await fs.readFile(path.join(commitPath, "commit.json"), "utf8");
        commitMeta = JSON.parse(metaContent);
      } catch (err) {
        console.warn(`Could not read commit metadata for ${commitDir}:`, err.message);
      }

      commits.push({
        commitId: commitDir,
        message: commitMeta.message || await safeReadFile(path.join(commitPath, "message.txt")),
        timestamp: commitMeta.timestamp || new Date().toISOString(),
        author: user,
        files: Array.from(commitFiles.get(commitDir) || [])
      });
    }

    return commits;
  } catch (error) {
    console.error("Error getting committed files:", error);
    return [];
  }
}

module.exports = { pushRepo, getCommittedFiles };