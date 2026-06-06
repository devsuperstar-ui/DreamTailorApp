/**
 * Appended to every resume prompt (auto + manual) to maximize ATS keyword match.
 * Goal: 100% coverage of required JD terms — especially industry/domain language.
 */
export const ATS_100_PROMPT_BLOCK = `
---

## ATS 100% TARGET (mandatory — verify before returning JSON)

**Goal:** Score **100%** on keyword-matching ATS for this JOB DESCRIPTION — with **industry/domain** as the top priority after the job title.

### Step 1 — Extract JD keywords (do this first)

**A. Industry & domain (highest ATS priority)**
- Identify the JD **industry/sector** (e.g. healthcare, fintech, logistics, EdTech, SaaS, manufacturing, telecom, insurance).
- Extract **every** domain phrase, vertical term, product type, customer segment, and business context word from the JD.
- Extract **compliance/regulatory** terms (e.g. **HIPAA**, **SOC 2**, **PCI-DSS**, **GDPR**, **FDA**, **SOX**) if mentioned or implied by the sector.
- Extract **workflow/domain nouns** (e.g. EHR, claims processing, TMS, ERP sync, payment rails, underwriting, fleet operations).

**B. Technical & role keywords**
- Every **required** and **preferred** skill, tool, platform, framework, cloud service, methodology, certification.
- **Exact job title** phrasing and **seniority** from the JD.

### Step 2 — 100% coverage rules

1. **\`"title"\`** — JD job title **verbatim**.
2. **\`"summary"\`** — open with title + **industry/domain fit from the JD** (sector, product type, compliance). Include **all must-have technologies** (exact JD spelling) plus **10–15 industry/domain keywords** from the JD woven naturally.
3. **\`"skills"\`** — include **every required** skill/tool (exact wording) **and** a dedicated category such as **"Industry & Domain"** or **"Compliance & Regulations"** listing JD industry/compliance/workflow terms. Include **≥80% of preferred** skills. ~40–48 skills total. **Never omit a required JD or industry keyword.**
4. **\`"experience"\` bullets** — every **required** technical keyword **and** the top **industry/domain/compliance** terms from the JD must each appear **at least once** across bullets (credible per employer/dates). Frame achievements in the **JD's industry context** (e.g. healthcare payer workflows, freight TMS integrations)—not a generic software-only voice unless the JD is generic.
5. **Terminology** — use the JD's exact industry and tool spellings; do not substitute synonyms for named sectors, regulations, or products.
6. **Metrics** — only **4–6 metrics total** for the **entire resume** (summary + all experience bullets). Prefer concrete scale (e.g. **1.2M daily transactions**) over vanity **%** claims. All other bullets stay technical.

### Step 3 — Industry ATS self-check (silent, before output)
- [ ] JD **industry/sector** named or clearly signaled in summary
- [ ] **Every** compliance/regulatory term from the JD appears in skills or bullets
- [ ] **≥10 industry/domain/workflow** terms from the JD appear across summary + skills + bullets
- [ ] Every **required** technical skill in skills, summary, or experience
- [ ] **Preferred** skills: ≥80% covered
- [ ] Job title matches JD; seniority tone matches JD
- [ ] Natural prose — not a keyword dump
- [ ] **≤6 metrics total** across summary + all bullets (count before output)

Only return JSON after this check passes.
`;

/** James Principe — appended last so it overrides the generic 4–6 metric cap. */
export const JAMES_PRINCIPE_METRICS_BLOCK = `
---

## JAMES PRINCIPE — METRICS OVERRIDE (final rule; supersedes generic metric limits above)

Use **6–8 quantified outcomes** across summary + all experience bullets:

- **3–4 percentage improvements** — latency, cost, deployment time, error rate, throughput, test coverage, or incident reduction. Use credible ranges (**15–45%**), prefix estimates with **~**, and **bold the number** (e.g. cut API latency by **~32%**).
- **2–3 scale metrics** — subscribers, daily requests, services, teams, or uptime (e.g. **2M+ subscribers**, **99.9% uptime**).
- Place **≥2 % metrics** on **Kiggla** (newest) and **≥2 % metrics** on **Lebara**; at most **1 % metric** on older roles.
- **One % or scale metric** in the summary is encouraged.
- Do **not** put a **%** in every bullet — mix with technical depth bullets.
- Every % claim must tie to a **specific action** (optimization, migration, automation, caching, CI/CD) — never a standalone vanity KPI.
`;

/** Append ATS block once (avoids duplicate if template already includes it). */
export function appendAtsBlock(prompt) {
  if (!prompt?.trim()) return prompt;
  if (prompt.includes("ATS 100% TARGET")) return prompt;
  return `${prompt.trim()}\n${ATS_100_PROMPT_BLOCK}`;
}

/** Profile-specific suffixes (e.g. James metrics) — always appended after ATS block. */
export function appendProfilePromptSuffix(prompt, profileSlug) {
  if (!prompt?.trim()) return prompt;
  const isJames =
    profileSlug === "jp1" || prompt.includes("James Principe — credible across");
  if (isJames && !prompt.includes("JAMES PRINCIPE — METRICS OVERRIDE")) {
    return `${prompt.trim()}\n${JAMES_PRINCIPE_METRICS_BLOCK}`;
  }
  return prompt;
}

export function finalizeResumePrompt(prompt, profileSlug) {
  return appendProfilePromptSuffix(appendAtsBlock(prompt), profileSlug);
}
