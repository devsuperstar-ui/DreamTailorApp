import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "prompts");

const replacements = [
  [
    /\*\*Profile:\*\* Drew Wilson — freight\/logistics, education technology, and consulting; align Node\/API\/cloud stacks to each employer\./,
    "**Profile:** Drew Wilson — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /You are an expert ATS resume writer for \*\*backend \/ full-stack engineering\*\* \(logistics, EdTech, and consulting\)\./,
    "You are an expert ATS resume writer for **backend / full-stack engineering** roles.",
  ],
  [
    /Logistics and EdTech domain terms when relevant\. /,
    "Use domain and stack terms from the JD only. ",
  ],
  [
    /\*\*{{experienceCount}}\*\* jobs\. \*\*≤5 bullets\/job\*\*, \*\*28–38 words\*\*\. Nearpod\/OfficeRnD: product SaaS; freight role: integrations and high-volume ops\./,
    "**{{experienceCount}}** jobs. **≤5 bullets/job**, **28–38 words**. Each role: JD-aligned bullets plausible for that company, title, and dates.",
  ],
  [
    /\*\*Profile:\*\* Manuel Vargas — tailor bullets to the JD while staying credible for logistics\/freight, EdTech, and B2B SaaS-style delivery; keep claims aligned to his dates\./,
    "**Profile:** Manuel Vargas — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /1\. Open with \*\*{{resumeTitle}}\*\*, years of experience, and domain fit \(freight\/logistics systems, education platforms, and B2B SaaS\)\./,
    "1. Open with **{{resumeTitle}}**, years of experience, and domain fit **from the JD**.",
  ],
  [
    /\*\*Realism:\*\* Match engineering scope to each company\/time period \(Freight: integrations\/ops; EdTech: platform features; Office\/coworking: customer-facing SaaS and workflows\)\./,
    "**Realism:** Each bullet must fit that employer, title, and dates while prioritizing JD keywords—not assumed industry labels.",
  ],
  [
    /\*\*Profile:\*\* Joel Daniel Matos Dias — tailor bullets to the JD while staying credible for logistics\/freight, EdTech, and B2B SaaS; align stacks and scope to each employer's dates\./,
    "**Profile:** Joel Daniel Matos Dias — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /1\. Open with \*\*{{resumeTitle}}\*\*, years of experience, and domain fit \(freight\/logistics, EdTech, consulting\/SaaS\)\./,
    "1. Open with **{{resumeTitle}}**, years of experience, and domain fit **from the JD**.",
  ],
  [
    /\*\*Realism:\*\* Freight role = TMS\/integrations\/ops scale; Nearpod = EdTech product; OfficeRnD\/Kiggla = B2B SaaS and consulting delivery\./,
    "**Realism:** Each bullet must fit that employer, title, and dates while prioritizing JD keywords—not assumed industry labels.",
  ],
  [
    /You are an expert ATS resume writer for \*\*backend \/ full-stack engineering\*\* in logistics, marketplaces, and industrial software\./,
    "You are an expert ATS resume writer for **backend / full-stack engineering** roles.",
  ],
  [
    /\*\*Profile:\*\* Samuel Acord — tailor to the JD; keep DoorDash\/freight\/Hexagon timelines realistic \(delivery platforms, TMS, measurement tech\)\./,
    "**Profile:** Samuel Acord — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /\*\*2–3 bold\*\* JD terms\. Freight\/logistics bullets should not claim pure consumer-only stacks unless dates support it\./,
    "**2–3 bold** JD terms. Stacks and domain language must fit each role's dates and employer while matching the JD.",
  ],
  [
    /\*\*Profile:\*\* Buck Young — long tenure in HR\/recruiting \(JazzHR\) plus e-commerce and supply chain; match stacks to each phase\./,
    "**Profile:** Buck Young — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /Mention recruiting\/ATS or payments\/gift-card domain only when relevant\. /,
    "Use domain terms from the JD only. ",
  ],
  [
    /1\. Open with \*\*{{resumeTitle}}\*\*, years of experience, and domain fit \(life sciences, lab systems, enterprise SaaS, or JD industry\)\./,
    "1. Open with **{{resumeTitle}}**, years of experience, and domain fit **from the JD**.",
  ],
  [
    /\*\*Profile:\*\* Dawid Gupta — Hexagon and enterprise consulting background; credible for measurement, geospatial, or B2B platform JDs\./,
    "**Profile:** Dawid Gupta — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /\*\*{{experienceCount}}\*\* jobs\. \*\*≤5 bullets\/job\*\*, \*\*28–38 words\*\*\. Long Hexagon tenure: deepest enterprise\/industrial claims\./,
    "**{{experienceCount}}** jobs. **≤5 bullets/job**, **28–38 words**. Each role: JD-aligned bullets plausible for that company, title, and dates.",
  ],
  [
    /Early logistics role stays junior-scope; health and AI roles can carry deeper stack claims\./,
    "Earlier roles: junior-appropriate scope; later roles: depth aligned to the JD and title seniority.",
  ],
  [
    /\*\*Profile:\*\* Chris Lewis — Airbnb AI, Adobe frontend, FinTech and health background; lead with AI\/ML when JD targets it, else strong frontend\/platform narrative\./,
    "**Profile:** Chris Lewis — tailor title, summary, skills, and all bullets to the **JOB DESCRIPTION**; stay credible for each employer, title, and date.",
  ],
  [
    /1\. \*\*{{resumeTitle}}\*\* \+ {{yearsOfExperience}}\+ years \+ domain\/industry from the JD \+ startup\/enterprise context\./,
    "1. **{{resumeTitle}}** + {{yearsOfExperience}}+ years + domain and context **from the JD**.",
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
    }
  }
  if (n) {
    fs.writeFileSync(fp, text, "utf8");
    console.log(`${file}: ${n} replacement(s)`);
  }
}
