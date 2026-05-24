import fs from "fs";
import path from "path";
import { TEMPLATE_THEMES } from "@/lib/pdf-templates/template-themes";
import {
  RESUME_STYLE_PRESETS,
  resolveResumePresentation,
} from "@/lib/resume-style-presets";
import profileTemplateMapping, {
  getTemplateForProfile,
} from "@/lib/profile-template-mapping";

const RESUMES_DIR = path.join(process.cwd(), "data", "resumes");

function templateLabel(templateId) {
  return TEMPLATE_THEMES[templateId]?.label || templateId;
}

function buildSlugByResumeName() {
  const map = {};
  for (const [slug, cfg] of Object.entries(profileTemplateMapping)) {
    const name = cfg.resume;
    if (!map[name]) map[name] = [];
    map[name].push(slug);
  }
  return map;
}

function loadResumeRows() {
  const slugByResume = buildSlugByResumeName();
  const files = fs
    .readdirSync(RESUMES_DIR)
    .filter((f) => f.endsWith(".json") && f !== "_template.json");

  return files
    .map((file) => {
      const name = file.replace(/\.json$/, "");
      const filePath = path.join(RESUMES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const slugs = slugByResume[name] || [];
      const primarySlug = slugs[0] || null;
      const presentation = resolveResumePresentation(
        data,
        primarySlug,
        getTemplateForProfile
      );
      return {
        name,
        resumeStyle: presentation.resumeStyle,
        template: presentation.template,
        templateLabel: templateLabel(presentation.template),
        headerLayout: presentation.headerLayout,
        profileSlugs: slugs,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildTemplateCatalog() {
  const resumes = loadResumeRows();

  const templates = Object.values(TEMPLATE_THEMES)
    .map((theme) => {
      const resumeStyles = Object.entries(RESUME_STYLE_PRESETS)
        .filter(([, p]) => p.template === theme.id)
        .map(([id]) => id);
      const usedByResumes = resumes.filter((r) => r.template === theme.id).map((r) => r.name);
      return {
        id: theme.id,
        name: theme.label,
        headerLayout: theme.headerLayout,
        resumeStyles,
        usedByResumes,
      };
    })
    .sort((a, b) => {
      if (a.id === "Resume") return -1;
      if (b.id === "Resume") return 1;
      return a.name.localeCompare(b.name);
    });

  const resumeStyles = Object.entries(RESUME_STYLE_PRESETS)
    .map(([id, preset]) => ({
      id,
      template: preset.template,
      templateLabel: templateLabel(preset.template),
      headerLayout: preset.headerLayout,
      usedByResumes: resumes.filter((r) => r.resumeStyle === id).map((r) => r.name),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    templates,
    resumeStyles,
    resumes,
    headerLayouts: ["center", "split", "left"],
  };
}
