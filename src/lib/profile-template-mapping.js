// Profile to Template mapping
// Maps profile ID (filename without .json) to template ID and optional prompt file
// Keep template in sync with data/resumes/<name>.json (see RESUME_PRESENTATION_BY_NAME)
export const profileTemplateMapping = {
    "vm1": {
        resume: "Vinay Matoori",
        template: "Resume-Modern-Green",
        prompt: "vinay-matorio"
    },
    "ok1": {
        resume: "Olexandr Kutakh",
        template: "Resume-Academic-Purple",
        prompt: "olexandr-kutakh"
    },
    "samuelacord": {
        resume: "Samuel Acord",
        template: "Resume-Bold-Emerald",
        prompt: "samuel-acord"
    },
    "al1": {
        resume: "Adam Lee",
        template: "Resume-Bold-Emerald",
        prompt: "adam-lee"
    },
    "md1": {
        resume: "Michael Douglas",
        template: "Resume-Executive-Navy",
        prompt: "michael-douglas"
    },
    "jd1": {
        resume: "James Davis",
        template: "Resume-Modern-Green",
        prompt: "james-davis"
    },
    "er1": {
        resume: "Edward Reyes",
        template: "Resume-Academic-Purple",
        prompt: "default"
    },
    "jh1": {
        resume: "Johnny Ha",
        template: "Resume-Creative-Burgundy",
        prompt: "default"
    },
    "kl1": {
        resume: "Kendall Lewis",
        template: "Resume-Tech-Teal",
        prompt: "kendall-lewis"
    },
    "by1": {
        resume: "Buck Young",
        template: "Resume-Classic-Charcoal",
        prompt: "default"
    },
    "kb1": {
        resume: "Kenton Brown",
        template: "Resume-Corporate-Slate",
        prompt: "default"
    },
    "cl1": {
        resume: "Chris Lewis",
        template: "Resume-Tech-Teal",
        prompt: "default"
    },
    "dg1": {
        resume: "Dawid Gupta",
        template: "Resume-Corporate-Slate",
        prompt: "default"
    },
    "dw1": {
        resume: "Drew Wilson",
        template: "Resume",
        prompt: "default"
    },
    "jp1": {
        resume: "James Principe",
        template: "Resume-Consultant-Steel",
        prompt: "james-principe"
    },
    "ap1": {
        resume: "Angelica Penalba",
        template: "Resume-Executive-Navy",
        prompt: "james-davis"
    },
};

/**
 * Get profile configuration by slug (numeric ID)
 * @param {string} slug - The numeric ID slug (e.g., "1", "2", "3")
 * @returns {object|null} - Profile configuration or null if not found
 */
export const getProfileBySlug = (slug) => {
    if (!slug) return null;
    return profileTemplateMapping[slug] || null;
};

/**
 * Get resume name (profile name) by slug
 * @param {string} slug - The numeric ID slug (e.g., "1", "2", "3")
 * @returns {string|null} - Resume name or null if not found
 */
export const slugToProfileName = (slug) => {
    const config = getProfileBySlug(slug);
    return config?.resume || null;
};

/**
 * Get template for a profile by slug
 * @param {string} slug - The numeric ID slug (e.g., "1", "2", "3")
 * @returns {string} - Template ID or "Resume" as default
 */
export const getTemplateForProfile = (slug) => {
    const config = getProfileBySlug(slug);
    return config?.template || "Resume";
};

/**
 * Get prompt file name for a profile by slug
 * @param {string} slug - The numeric ID slug (e.g., "1", "2", "3")
 * @returns {string} - Prompt file name or "default"
 */
export const getPromptForProfile = (slug) => {
    const config = getProfileBySlug(slug);
    return config?.prompt || "default";
};

/**
 * Get all available slug values (numeric IDs from mapping)
 * @returns {string[]} - Array of available slugs (numeric IDs)
 */
export const getAvailableSlugs = () => {
    return Object.keys(profileTemplateMapping);
};

export default profileTemplateMapping;
