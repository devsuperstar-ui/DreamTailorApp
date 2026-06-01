import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");

/** Apply 1.5× to experience bullet limits (5→8, 4–5→6–8). Order: longest patterns first. */
const replacements = [
  [
    "**Bullet counts:** newest role **5 bullets**, second role **5**, third **4–5**, oldest **4–5**. Do not exceed **5 bullets per job**.",
    "**Bullet counts:** newest role **8 bullets**, second role **8**, third **6–8**, oldest **6–8**. Do not exceed **8 bullets per job**.",
  ],
  [
    "**Bullet counts:** newest role **5 bullets**, second **5**, older roles **4–5** each. **Do not exceed 5 bullets per job.**",
    "**Bullet counts:** newest role **8 bullets**, second **8**, older roles **6–8** each. **Do not exceed 8 bullets per job.**",
  ],
  [
    "**Bullet counts:** newest **5**, second **5**, older **4–5**. **≤5 bullets per job**.",
    "**Bullet counts:** newest **8**, second **8**, older **6–8**. **≤8 bullets per job**.",
  ],
  [
    "**Bullet counts:** newest role **8**, second **7**, older roles **5–6**. **Do not exceed 5 bullets per job**.",
    "**Bullet counts:** newest role **8**, second **8**, older roles **6–8**. **Do not exceed 8 bullets per job**.",
  ],
  [
    "Exactly **{{experienceCount}}** jobs. **5 bullets** (newest), **5** (second), **4–5** (older).",
    "Exactly **{{experienceCount}}** jobs. **8 bullets** (newest), **8** (second), **6–8** (older).",
  ],
  ["(≤5 bullets per job)", "(≤8 bullets per job)"],
  ["≤5 bullets per job", "≤8 bullets per job"],
  ["≤5 bullets/job", "≤8 bullets/job"],
  ["**≤5 bullets per job**", "**≤8 bullets per job**"],
  ["**≤5 bullets/job**", "**≤8 bullets/job**"],
  ["Do not exceed 5 bullets per job", "Do not exceed 8 bullets per job"],
  ["**Do not exceed 5 bullets per job.**", "**Do not exceed 8 bullets per job.**"],
  ["newest role **5 bullets**, second **5**", "newest role **8 bullets**, second **8**"],
];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".txt")) continue;
  const fp = path.join(dir, file);
  let text = fs.readFileSync(fp, "utf8");
  let n = 0;
  for (const [from, to] of replacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      n++;
    }
  }
  if (n) {
    fs.writeFileSync(fp, text, "utf8");
    console.log(`${file}: ${n}`);
  }
}
