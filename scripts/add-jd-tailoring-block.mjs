import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");
const JD_BLOCK = `
## JD-FIRST TAILORING

Work history lists **companies, titles, dates, and locations only** (no industry field). Use the **JOB DESCRIPTION** as the primary source for domain language, technologies, compliance terms, seniority, and priorities. Tailor the title, summary, skills, and every experience bullet to the JD while keeping each role credible for its employer, title, and dates (~**70% JD** / ~**30%** plausible inference from role + company).

`;

const marker = "## JD-FIRST TAILORING";
const insertAfter = /(\{\{jobDescription\}\}\s*\r?\n\r?\n---\s*\r?\n)/;

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".txt")) continue;
  const fp = path.join(dir, file);
  let text = fs.readFileSync(fp, "utf8");
  if (text.includes(marker)) {
    console.log("Skip:", file);
    continue;
  }
  if (!insertAfter.test(text)) {
    console.log("WARN no anchor:", file);
    continue;
  }
  text = text.replace(insertAfter, `$1${JD_BLOCK}`);
  fs.writeFileSync(fp, text, "utf8");
  console.log("Updated:", file);
}
