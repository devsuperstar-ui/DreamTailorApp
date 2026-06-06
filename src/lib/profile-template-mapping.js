// Profile to Template mapping
// Maps profile slug to resume JSON name and PDF template.
// All profiles share data/prompts/default.txt (tailoring comes from JD + work history variables).
export const profileTemplateMapping = {
    "vm1": {
        resume: "Vinay Matoori",
        template: "Resume-Modern-Green",
    },
    "ok1": {
        resume: "Olexandr Kutakh",
        template: "Resume-Academic-Purple",
    },
    "samuelacord": {
        resume: "Samuel Acord",
        template: "Resume-Bold-Emerald",
    },
    "al1": {
        resume: "Adam Lee",
        template: "Resume-Bold-Emerald",
    },
    "md1": {
        resume: "Michael Douglas",
        template: "Resume-Executive-Navy",
    },
    "jd1": {
        resume: "James Davis",
        template: "Resume-Modern-Green",
    },
    "er1": {
        resume: "Edward Reyes",
        template: "Resume-Academic-Purple",
    },
    "jh1": {
        resume: "Johnny Ha",
        template: "Resume-Creative-Burgundy",
    },
    "kl1": {
        resume: "Kendall Lewis",
        template: "Resume-Tech-Teal",
    },
    "by1": {
        resume: "Buck Young",
        template: "Resume-Classic-Charcoal",
    },
    "kb1": {
        resume: "Kenton Brown",
        template: "Resume-Corporate-Slate",
    },
    "cl1": {
        resume: "Chris Lewis",
        template: "Resume-Tech-Teal",
    },
    "dg1": {
        resume: "Dawid Gupta",
        template: "Resume-Corporate-Slate",
    },
    "dw1": {
        resume: "Drew Wilson",
        template: "Resume",
    },
    "jp1": {
        resume: "James Principe",
        template: "Resume-Consultant-Steel",
    },
    "ap1": {
        resume: "Angelica Penalba",
        template: "Resume-Executive-Navy",
    },
    "mv1": {
        resume: "Manuel Vargas",
        template: "Resume",
    },
    "jm1": {
        resume: "Joel Matos",
        template: "Resume",
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
 * Get all available slug values (numeric IDs from mapping)
 * @returns {string[]} - Array of available slugs (numeric IDs)
 */
export const getAvailableSlugs = () => {
    return Object.keys(profileTemplateMapping);
};

export default profileTemplateMapping;
