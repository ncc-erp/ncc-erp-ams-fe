const fs = require("fs");
const path = require("path");

const requiredEnvKeys = [
  "REACT_APP_API_PROXY",
  "REACT_APP_AUTH_CLIENT_ID",
  "REACT_APP_SHOW_MANUAL_LOGIN",
  "REACT_APP_GOOGLE_CLIENT_ID",
];

const envFilePath = path.resolve(__dirname, "../.env");
// const envExampleFilePath = path.resolve(__dirname, "../.env.example");

function validateEnv(filePath, requiredKeys) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const envContent = fs.readFileSync(filePath, "utf-8");
  const envKeys = envContent
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=")[0]);

  const missingKeys = requiredKeys.filter((key) => !envKeys.includes(key));

  if (missingKeys.length > 0) {
    console.error(`Missing required keys in ${filePath}:`, missingKeys);
    process.exit(1);
  }

  console.log(`Validation passed for ${filePath}`);
}

validateEnv(envFilePath, requiredEnvKeys);
// validateEnv(envExampleFilePath, requiredEnvKeys);
