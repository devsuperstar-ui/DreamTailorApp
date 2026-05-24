import { TEMPLATE_THEMES } from "@/lib/pdf-templates/template-themes";
import { RESUME_STYLE_PRESETS, getResumeStylePresetKeys } from "@/lib/resume-style-presets";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const templates = Object.values(TEMPLATE_THEMES)
      .map(({ id, label }) => ({ id, name: label }))
      .sort((a, b) => {
        if (a.id === "Resume") return -1;
        if (b.id === "Resume") return 1;
        return a.name.localeCompare(b.name);
      });

    const resumeStyles = getResumeStylePresetKeys().map((key) => ({
      id: key,
      ...RESUME_STYLE_PRESETS[key],
    }));

    res.status(200).json({
      templates,
      resumeStyles,
      headerLayouts: ["center", "split", "left"],
    });
  } catch (error) {
    console.error("Error loading templates:", error);
    res.status(500).json({ error: "Failed to load templates" });
  }
}
