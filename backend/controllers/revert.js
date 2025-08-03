const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);

const copyFile = promisify(fs.copyFile);

async function revertRepo(commitId) {
   const repoPath = path.resolve(process.cwd(), '.github_clone');
   const commitsPath = path.join(repoPath, 'commits');

   try {
       const commitDirs = path.join(commitsPath, String(commitId));
       const files = await readdir(commitDirs);

       const parentDir = path.resolve(repoPath, '..');

       for (const file of files) {
        await copyFile(
           path.join(commitDirs, file),
           path.join(parentDir, file)
       );
       }

       console.log(`Reverted to commit ${commitId} successfully.`);

   } catch (error) {
       console.error("Unable to  reverte :", error); 
   }

  }
  
  module.exports = {revertRepo};