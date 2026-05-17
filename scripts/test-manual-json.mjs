import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Dynamic import via Next's transpilation isn't available; duplicate minimal checks:
const profile = JSON.parse(
  fs.readFileSync(path.join(root, "data/resumes/Drew Wilson.json"), "utf8")
);
const userJson = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : null;

if (!userJson) {
  console.log("Drew Wilson profile jobs:", profile.experience.length);
  process.exit(0);
}

let data;
try {
  data = JSON.parse(userJson);
} catch (e) {
  console.error("JSON.parse failed:", e.message);
  process.exit(1);
}

console.log("Parsed OK");
console.log("User experience count:", data.experience?.length);
console.log("Profile expects:", profile.experience.length);
console.log(
  "Match:",
  data.experience?.length === profile.experience.length ? "YES" : "NO"
);
