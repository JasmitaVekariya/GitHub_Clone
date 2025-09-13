const fs = require("fs").promises;
const path = require("path");

async function addRepo(repoName, filepath) {
  const repoPath = path.resolve(process.cwd(), ".github_clone");
  const repofolder = path.join(repoPath , repoName);
  const stagingPath = path.join(repofolder, "staging");
  
  try {
    // Ensure the staging directory exists
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName= path.basename(filepath);
    // here we are reading the file from the given filepath
    await fs.copyFile(filepath, path.join(stagingPath, fileName));
    // this is make copy of orignal file
    console.log(`File ${fileName} added to staging area.`);

  }
  catch (error) {
    console.error("Error Adding file", error);
    // throw new Error("Failed to create staging directory: " + error.message);

  }
  }
  
  module.exports = {addRepo};