const fs = require("fs").promises; //file system 
const path = require("path");


async function initRepo(repoName) {
  const repoPath = path.resolve(process.cwd(), '.github_clone'); // Get the current working directory and append .myrepo
  const repofolder = path.join(repoPath , repoName);
  const commitsPath = path.join(repofolder,"commits");

  try{
    await fs.mkdir(repoPath,{recursive: true });
    await fs.mkdir(repofolder,{recursive: true });
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