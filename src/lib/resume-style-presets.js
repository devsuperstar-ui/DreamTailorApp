/**
 * Resume presentation presets and per-resume overrides.
 *
 * Each resume JSON may include:
 *   - resumeStyle: preset key (classic, technical, executive, professional, …)
 *   - template: explicit PDF template id (overrides preset + profile mapping)
 *   - headerLayout: "center" | "split" | "left" (overrides preset alignment)
 *
 * Resolution order for template:
 *   resume JSON "template" → preset template → profile-template-mapping → "Resume"
 *
 * Resolution order for headerLayout:
 *   resume JSON "headerLayout" → preset headerLayout → template default (center)
 */

export const RESUME_STYLE_PRESETS = {
  standard: {
    template: "Resume",
    headerLayout: "center",
  },
  classic: {
    template: "Resume-Classic-Charcoal",
    headerLayout: "center",
  },
  technical: {
    template: "Resume-Tech-Teal",
    headerLayout: "split",
  },
  "technical-left": {
    template: "Resume-Tech-Teal",
    headerLayout: "left",
  },
  executive: {
    template: "Resume-Executive-Navy",
    headerLayout: "center",
  },
  "executive-split": {
    template: "Resume-Executive-Navy",
    headerLayout: "split",
  },
  "executive-left": {
    template: "Resume-Executive-Navy",
    headerLayout: "left",
  },
  professional: {
    template: "Resume-Corporate-Slate",
    headerLayout: "split",
  },
  "professional-center": {
    template: "Resume-Corporate-Slate",
    headerLayout: "center",
  },
  academic: {
    template: "Resume-Academic-Purple",
    headerLayout: "center",
  },
  "academic-left": {
    template: "Resume-Academic-Purple",
    headerLayout: "left",
  },
  creative: {
    template: "Resume-Creative-Burgundy",
    headerLayout: "center",
  },
  bold: {
    template: "Resume-Bold-Emerald",
    headerLayout: "center",
  },
  "bold-split": {
    template: "Resume-Bold-Emerald",
    headerLayout: "split",
  },
  consultant: {
    template: "Resume-Consultant-Steel",
    headerLayout: "center",
  },
  modern: {
    template: "Resume-Modern-Green",
    headerLayout: "split",
  },
  "modern-center": {
    template: "Resume-Modern-Green",
    headerLayout: "center",
  },
  "standard-left": {
    template: "Resume",
    headerLayout: "left",
  },
};

/**
 * Canonical presentation per resume file (name without .json).
 * Each person has a unique resumeStyle; template + headerLayout are stored explicitly in JSON too.
 */
export const RESUME_PRESENTATION_BY_NAME = {
  "Adam Lee": {
    resumeStyle: "bold",
    template: "Resume-Bold-Emerald",
    headerLayout: "center",
  },
  "Angelica Penalba": {
    resumeStyle: "executive-left",
    template: "Resume-Executive-Navy",
    headerLayout: "left",
  },
  "Buck Young": {
    resumeStyle: "classic",
    template: "Resume-Classic-Charcoal",
    headerLayout: "center",
  },
  "Chris Lewis": {
    resumeStyle: "technical",
    template: "Resume-Tech-Teal",
    headerLayout: "split",
  },
  "Dawid Gupta": {
    resumeStyle: "professional",
    template: "Resume-Corporate-Slate",
    headerLayout: "split",
  },
  "Drew Wilson": {
    resumeStyle: "standard-left",
    template: "Resume",
    headerLayout: "left",
  },
  "Edward Reyes": {
    resumeStyle: "academic-left",
    template: "Resume-Academic-Purple",
    headerLayout: "left",
  },
  "James Davis": {
    resumeStyle: "modern",
    template: "Resume-Modern-Green",
    headerLayout: "split",
  },
  "James Principe": {
    resumeStyle: "consultant",
    template: "Resume-Consultant-Steel",
    headerLayout: "center",
  },
  "Johnny Ha": {
    resumeStyle: "creative",
    template: "Resume-Creative-Burgundy",
    headerLayout: "center",
  },
  "Kendall Lewis": {
    resumeStyle: "technical-left",
    template: "Resume-Tech-Teal",
    headerLayout: "left",
  },
  "Kenton Brown": {
    resumeStyle: "professional-center",
    template: "Resume-Corporate-Slate",
    headerLayout: "center",
  },
  "Michael Douglas": {
    resumeStyle: "executive-split",
    template: "Resume-Executive-Navy",
    headerLayout: "split",
  },
  "Olexandr Kutakh": {
    resumeStyle: "academic",
    template: "Resume-Academic-Purple",
    headerLayout: "center",
  },
  "Samuel Acord": {
    resumeStyle: "bold-split",
    template: "Resume-Bold-Emerald",
    headerLayout: "split",
  },
  "Vinay Matoori": {
    resumeStyle: "modern-center",
    template: "Resume-Modern-Green",
    headerLayout: "center",
  },
};

const VALID_HEADER_LAYOUTS = new Set(["center", "split", "left"]);

/**
 * @param {object|null|undefined} profileData - Parsed resume JSON
 * @param {string|null|undefined} profileSlug - Profile slug for mapping fallback
 * @param {(slug: string) => string} getTemplateForProfile - e.g. from profile-template-mapping
 * @returns {{ template: string, headerLayout: string, resumeStyle: string|null }}
 */
export function resolveResumePresentation(profileData, profileSlug, getTemplateForProfile) {
  const resumeStyle =
    profileData?.resumeStyle != null && String(profileData.resumeStyle).trim() !== ""
      ? String(profileData.resumeStyle).trim().toLowerCase()
      : null;

  const preset = resumeStyle ? RESUME_STYLE_PRESETS[resumeStyle] : null;

  const templateFromJson =
    profileData?.template != null && String(profileData.template).trim() !== ""
      ? String(profileData.template).trim()
      : null;

  const template =
    templateFromJson ||
    preset?.template ||
    (profileSlug && getTemplateForProfile ? getTemplateForProfile(profileSlug) : null) ||
    "Resume";

  let headerLayout = "center";
  if (profileData?.headerLayout != null) {
    const raw = String(profileData.headerLayout).trim().toLowerCase();
    if (VALID_HEADER_LAYOUTS.has(raw)) {
      headerLayout = raw;
    }
  } else if (preset?.headerLayout) {
    headerLayout = preset.headerLayout;
  }

  return { template, headerLayout, resumeStyle };
}

export function getResumeStylePresetKeys() {
  return Object.keys(RESUME_STYLE_PRESETS);
}

/** Lookup canonical presentation for a resume file name (without .json). */
export function getPresentationForResumeName(resumeName) {
  return RESUME_PRESENTATION_BY_NAME[resumeName] || null;
}
