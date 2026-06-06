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

### Step 3 — Industry ATS self-check (silent, before output)
- [ ] JD **industry/sector** named or clearly signaled in summary
- [ ] **Every** compliance/regulatory term from the JD appears in skills or bullets
- [ ] **≥10 industry/domain/workflow** terms from the JD appear across summary + skills + bullets
- [ ] Every **required** technical skill in skills, summary, or experience
- [ ] **Preferred** skills: ≥80% covered
- [ ] Job title matches JD; seniority tone matches JD
- [ ] Natural prose — not a keyword dump

Only return JSON after this check passes.
`;

/** Append ATS block once (avoids duplicate if template already includes it). */
export function appendAtsBlock(prompt) {
  if (!prompt?.trim()) return prompt;
  if (prompt.includes("ATS 100% TARGET")) return prompt;
  return `${prompt.trim()}\n${ATS_100_PROMPT_BLOCK}`;
}
