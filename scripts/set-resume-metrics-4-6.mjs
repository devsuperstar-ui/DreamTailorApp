import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");

const METRICS_LINE =
  "**Metrics (entire resume):** only **4–6 metrics total** across summary + all experience bullets (strongest only). Other bullets = architecture, integrations, APIs, cloud, concrete scale (e.g. **1.2M daily transactions**)—not a **%** KPI on every line.";

const replacements = [
  [
    /\*\*Metrics discipline:\*\* at most \*\*2–3 metrics per role\*\* \(strongest only\)\. Other bullets = architecture, integrations, APIs, cloud, concrete scale \(e\.g\. \*\*1\.2M daily transactions\*\*\)—not a \*\*%\*\* KPI on every line\.\n\n/g,
    `${METRICS_LINE}\n\n`,
  ],
  [
    /\*\*At most 2–3 metrics per role\*\* \(strongest only\)—other bullets stay technical: architecture, integrations, APIs, cloud, reliability, concrete scale\./g,
    "**Only 4–6 metrics total** for the whole resume (summary + all bullets)—other bullets stay technical: architecture, integrations, APIs, cloud, reliability, concrete scale.",
  ],
  [
    /\*\*At most 2–3 metrics per role\*\*; other bullets = architecture, integrations, and stack depth\./g,
    "**Only 4–6 metrics total** for the whole resume; other bullets = architecture, integrations, and stack depth.",
  ],
  [
    /\*\*At most 2–3 metrics per role\*\*; remaining bullets = technical depth without % KPIs\./g,
    "**Only 4–6 metrics total** for the whole resume; remaining bullets = technical depth without % KPIs.",
  ],
  [
    /\*\*At most 2–3 metrics per role\*\*; other bullets technical without % KPIs\./g,
    "**Only 4–6 metrics total** for the whole resume; other bullets technical without % KPIs.",
  ],
  [
    /\*\*At most 2–3 metrics per role\*\*; balance with technical bullets\./g,
    "**Only 4–6 metrics total** for the whole resume; balance with technical bullets.",
  ],
  [
    /\*\*At most 2–3 metrics per role\*\*; other bullets technical\./g,
    "**Only 4–6 metrics total** for the whole resume; other bullets technical.",
  ],
  [/\*\*≤2–3 metrics per role\*\*, rest technical/g, "**4–6 metrics total** (whole resume), rest technical"],
  [
    /- \*\*Do not\*\* put a percentage in every bullet\. Avoid lines like "improved\/reduced by \*\*45%\*\*" on most bullets—that reads estimated\./g,
    "- **Only 4–6 metrics total** for the entire resume (summary + all bullets). Do not put a **%** in every bullet—that reads estimated.",
  ],
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
  if (n) {
    fs.writeFileSync(fp, text, "utf8");
    console.log(file, n);
  }
}
