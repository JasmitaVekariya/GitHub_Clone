const fs = require("fs").promises; //file system 
const path = require("path");


async function initRepo() {
  const repoPath = path.resolve(process.cwd(), '.github_clone'); // Get the current working directory and append .myrepo
  const commitsPath = path.join(repoPath,"commits");

  try{
    await fs.mkdir(repoPath,{recursive: true });
    await fs.mkdir(commitsPath,{recursive: true });
    await fs.writeFile(
      path.join(repoPath,"config.json"),
      JSON.stringify({bucket : process.env.S3_Bucket})
  );
  console.log("repo created");
  }catch(err){
    console.error("Error Initialsing repository ",err);
  }
}

module.exports = {initRepo};