import * as path from "path";
import dotenv from "dotenv";
import { extractEnv } from "@violet/def/envVars";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export = extractEnv(process.env);
