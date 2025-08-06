const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
  REACT_APP_API_PROXY: z.string().nonempty("REACT_APP_API_PROXY is required"),
  REACT_APP_AUTH_CLIENT_ID: z
    .string()
    .nonempty("REACT_APP_AUTH_CLIENT_ID is required"),
  REACT_APP_SHOW_MANUAL_LOGIN: z
    .string()
    .nonempty("REACT_APP_SHOW_MANUAL_LOGIN is required"),
  REACT_APP_GOOGLE_CLIENT_ID: z
    .string()
    .nonempty("REACT_APP_GOOGLE_CLIENT_ID is required"),
});

function validateEnv() {
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error("Environment validation failed:", parsedEnv.error.format());
    process.exit(1);
  }

  console.log("Environment validation passed.");
}

validateEnv();
