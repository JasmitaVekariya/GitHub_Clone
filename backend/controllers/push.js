const fs = require('fs').promises;
const path = require('path');
const {s3, S3_BUCKET} = require('../config/aws-config.js'); 


async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.github_clone');
    const commitspath = path.join(repoPath, 'commits');

    try{
      const commitdirs = await fs.readdir(commitspath);
      for (const commitdir of commitdirs) {
        const commitPath = path.join(commitspath, commitdir);
        const files = await fs.readdir(commitPath);
        for (const file of files) {
          const filePath = path.join(commitPath, file);
          const fileContent = await fs.readFile(filePath);
          const params = {
            Bucket: S3_BUCKET,
            Key: `commits/${commitdir}/${file}`,
            Body: fileContent
          };

          await s3.upload(params).promise();
        }
        console.log(`Pushed commit ${commitdir} to S3 bucket ${S3_BUCKET}`);
      }
    }catch (error) {
        console.error("Error pushing repository:", error);
    }
  }
  
  module.exports = {pushRepo};