const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");
const glob = require("glob");

const VERCEL_TOKEN = "iXlPSv0wJcczaLbfVWyXK78X"; // 🔑 Buyer's Vercel token
const PROJECT_NAME = "store-deploy-test"; // 🏷️ Name shown on Vercel dashboard

const readFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(fileBuffer).digest("hex");
};

const uploadFile = async (filePath, token) => {
  const data = fs.readFileSync(filePath);
  const fileName = path.relative(process.cwd(), filePath);
  const sha = readFileHash(filePath);

  try {
    await axios.post(
      `https://api.vercel.com/v13/files`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
          "x-vercel-digest": sha,
          "x-vercel-filename": fileName,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    console.log(`✅ Uploaded: ${fileName}`);
    return { file: fileName, sha };
  } catch (err) {
    console.error(`❌ Failed to upload ${fileName}:`, err.response?.data || err.message);
    throw err;
  }
};

(async () => {
  try {
    const token = VERCEL_TOKEN;
    if (!token) throw new Error("Vercel token missing");

    const files = glob.sync("**/*", {
      ignore: ["node_modules/**", ".git/**"],
      nodir: true,
    });

    const fileHashes = await Promise.all(
      files.map((file) => uploadFile(file, token))
    );

    const deployRes = await axios.post(
      `https://api.vercel.com/v13/deployments`,
      {
        name: PROJECT_NAME,
        files: fileHashes,
        projectSettings: {
          framework: "nextjs",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🎉 Deployment started:");
    console.log(`🔗 ${deployRes.data.url}`);
  } catch (error) {
    console.error("🚨 Deployment failed:", error.response?.data || error.message);
  }
})();
