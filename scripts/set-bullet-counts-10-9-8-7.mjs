import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");

const BULLET_COUNTS_LINE =
  "**Bullet counts (most recent job first):** **10** bullets (newest), **9** (second), **8** (third), **7** (fourth and any older). If fewer than four jobs, use **10** then **9** then **8** for available roles only. Never exceed **10** on one job.";

const EXPERIENCE_SHORT =
  "**{{experienceCount}}** jobs. **10 / 9 / 8 / 7 bullets** per role (newest → oldest; 4th+ jobs: **7**). **28–38 words** per bullet.";

const replacements = [
  [/≤8 bullets\/job/g, "**10 / 9 / 8 / 7 bullets** per role (newest → oldest; 4th+ jobs: **7**)"],
  [/≤8 bullets per job/g, "10 / 9 / 8 / 7 bullets per role (newest → oldest)"],
  [/\(≤8 bullets per job\)/g, "(10 / 9 / 8 / 7 bullets per role)"],
  [
    /\*\*Bullet counts:\*\* newest role \*\*8 bullets\*\*, second role \*\*8\*\*, third \*\*6–8\*\*, oldest \*\*6–8\*\*\. Do not exceed \*\*8 bullets per job\*\*\./g,
    BULLET_COUNTS_LINE,
  ],
  [
    /\*\*Bullet counts:\*\* newest role \*\*8\*\*, second \*\*8\*\*, older roles \*\*6–8\*\*\. \*\*Do not exceed 8 bullets per job\*\*\./g,
    BULLET_COUNTS_LINE,
  ],
  [
    /\*\*Bullet counts:\*\* newest \*\*8\*\*, second \*\*8\*\*, older \*\*6–8\*\*\. \*\*≤8 bullets per job\*\*\./g,
    BULLET_COUNTS_LINE,
  ],
  [
    /- \*\*Bullet counts:\*\* newest role \*\*8 bullets\*\*, second \*\*8\*\*, older roles \*\*6–8\*\* each\. \*\*Do not exceed 8 bullets per job\.\*\*/g,
    `- ${BULLET_COUNTS_LINE}`,
  ],
  [
    /Exactly \*\*\{\{experienceCount\}\}\*\* jobs\. \*\*8 bullets\*\* \(newest\), \*\*8\*\* \(second\), \*\*6–8\*\* \(older\)\./g,
    `Exactly **{{experienceCount}}** jobs. ${BULLET_COUNTS_LINE}`,
  ],
  [/Experience: \*\*≤8 bullets\/job\*\*/g, "Experience: **10 / 9 / 8 / 7 bullets** per role"],
];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".txt")) continue;
  const fp = path.join(dir, file);
  let text = fs.readFileSync(fp, "utf8");
  let n = 0;
  for (const [re, rep] of replacements) {
    if (re.test(text)) {
      text = text.replace(re, rep);
      n++;
      re.lastIndex = 0;
    }
  }
  // Generic one-liner experience sections still with old pattern after partial replace
  text = text.replace(
    /\*\*\{\{experienceCount\}\}\*\* (jobs|entries)\. \*\*10 \/ 9 \/ 8 \/ 7 bullets\*\* per role \(newest → oldest; 4th\+ jobs: \*\*7\*\*\), \*\*28–38 words\*\*([^.\n]*)\./g,
    (m) => m
  );
  if (n) {
    fs.writeFileSync(fp, text, "utf8");
    console.log(file, n);
  }
}
