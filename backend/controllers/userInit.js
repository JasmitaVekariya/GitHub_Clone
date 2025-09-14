// controllers/userInit.js
const fs = require("fs").promises;
const path = require("path");

async function userInit(user) {
  const localRoot = path.resolve(process.cwd(), ".github_clone");
  const localUserFolder = path.join(localRoot, user);

  try {
    // Create local user folder only
    await fs.mkdir(localUserFolder, { recursive: true });

    console.log(`User '${user}' initialized locally at ${localUserFolder}`);
  } catch (err) {
    console.error("Error creating local user folder:", err);
  }
}

module.exports = { userInit };