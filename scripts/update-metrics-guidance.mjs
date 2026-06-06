import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");

const METRICS_BLOCK = `
### Bullet quality — selective metrics, senior technical voice

- **Do not** put a percentage or KPI in every bullet. Avoid resumes where nearly every line claims "improved/reduced/increased by **X%**"—that reads estimated and hurts credibility.
- Per role: use **at most 2–3 metrics** (only the strongest). Other bullets should be **technical achievements**: architecture, system design, integrations, APIs, cloud platforms, data flows, security, reliability, and scope.
- Prefer **concrete scale** over vague % gains: daily transaction volume, services owned, integration count, deployment cadence, data pipeline throughput, users supported.
- **Strong:** "Designed **Azure**-hosted API orchestration services for ERP synchronization supporting over **1.2M daily transactions**."
- **Weak:** "Improved throughput by **50%** through optimization."
- Vary bullets: design/architecture → implementation → integration → performance (metric optional) → collaboration/ownership.
`;

const replacements = [
  [
    /- \*\*2–3 bold JD\/tech phrases\*\* per bullet; include a metric on most bullets\./g,
    "- **2–3 bold JD/tech phrases** per bullet. **At most 2–3 metrics per role**—other bullets stay technical (architecture, integrations, stack, scale) without a % KPI.",
  ],
  [
    /\*\*2–3 bold\*\* JD\/tech phrases per bullet; include a metric on most bullets\./g,
    "**2–3 bold** JD/tech phrases per bullet. **At most 2–3 metrics per role**; remaining bullets = technical depth without % KPIs.",
  ],
  [
    /\*\*28–38 words\*\* each; \*\*2–3 bold\*\* phrases; metrics on most bullets\./g,
    "**28–38 words** each; **2–3 bold** phrases. **At most 2–3 metrics per role**; other bullets = architecture, integrations, and stack depth.",
  ],
  [
    /\*\*28–38 words per bullet\*\*—one achievement per bullet, not two merged\. \*\*2–3 bold phrases\*\* per bullet; include a metric on most bullets\./g,
    "**28–38 words per bullet**—one achievement per bullet, not two merged. **2–3 bold phrases** per bullet. **At most 2–3 metrics per role**; other bullets technical without % KPIs.",
  ],
  [
    /\*\*28–38 words\*\* each, \*\*2–3\*\* bold phrases, metrics on most bullets\./g,
    "**28–38 words** each, **2–3** bold phrases. **At most 2–3 metrics per role**; balance with technical bullets.",
  ],
  [
    /, \*\*28–38 words\*\*, metrics on most bullets\./g,
    ", **28–38 words**. **At most 2–3 metrics per role**; other bullets technical.",
  ],
  [
    /4\. \*\*Quantified impact:\*\* one strong result \(~%, \$, latency, uptime, users, or deployment speed\)—specific and believable\./g,
    "4. **One credible impact line** in the summary only (~%, scale, latency, or deployment)—not a wall of percentages.",
  ],
  [
    /4\. One credible quantified win \(latency, uptime, deployment speed, cost, users, or throughput\)\./g,
    "4. **One** credible impact line in the summary (scale, latency, or deployment)—avoid stacking % claims.",
  ],
  [
    /4\. One credible quantified win \(throughput, latency, reliability\/uptime, deployment cadence, cost, or operational efficiency\)\./g,
    "4. **One** credible impact line in the summary (concrete scale or reliability)—not multiple % metrics.",
  ],
  [
    /4\. One sharp metric \(deployment speed, latency, uptime, cost, or scale\)\./g,
    "4. **One** strong impact line in the summary (concrete scale preferred over a lone %).",
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
  if (file === "default.txt" && !text.includes("Bullet quality — selective metrics")) {
    text = text.replace(
      /(\*\*Avoid:\*\* "Responsible for".*?"Worked on"\s*\n)/,
      `$1${METRICS_BLOCK}\n`
    );
    n++;
  }
  if (n) {
    fs.writeFileSync(fp, text, "utf8");
    console.log(file, n);
  }
}
