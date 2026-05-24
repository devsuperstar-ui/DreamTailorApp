import { getTemplate } from "@/lib/pdf-templates";
import { renderPdfBuffer } from "@/lib/pdf-render";
import { loadProfilePreviewPayload } from "@/lib/profile-preview-server";
import { mockResumeContentForExperienceCount } from "@/lib/preview-mock-content";
import { buildResumePdfData } from "@/lib/profile-utils";

const GENERIC_MOCK_PROFILE = {
  name: "John Smith",
  title: "Senior Software Engineer",
  email: "john.smith@example.com",
  phone: "+1 (415) 555-0100",
  location: "San Francisco, CA 94102",
  linkedin: "https://www.linkedin.com/in/example",
  linkedinShow: "show",
  experience: [
    { company: "Tech Corp", location: "San Francisco, CA", title: "Senior Software Engineer", start_date: "Jan 2021", end_date: "Present" },
    { company: "StartupXYZ", location: "San Francisco, CA", title: "Software Engineer", start_date: "Mar 2019", end_date: "Dec 2020" },
    { company: "WebDev Solutions", location: "San Francisco, CA", title: "Junior Software Engineer", start_date: "Jun 2017", end_date: "Feb 2019" },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      start_year: "2013",
      end_year: "2017",
      grade: "3.8",
    },
  ],
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { template, profile } = req.query;
    const templateOverride = typeof template === "string" ? template : null;

    if (!profile && !templateOverride) {
      return res.status(400).send("Provide template=... or profile=... (slug, e.g. jd1)");
    }

    let templateName;
    let templateData;
    let filename = "preview";

    if (profile && typeof profile === "string") {
      const loaded = loadProfilePreviewPayload(profile, templateOverride);
      if (!loaded.ok) {
        return res.status(loaded.status).send(loaded.message);
      }
      templateName = loaded.templateId;
      templateData = loaded.templateData;
      filename = `preview-${profile}-${templateName}`;
    } else {
      templateName = templateOverride || "Resume";
      const mockContent = mockResumeContentForExperienceCount(
        GENERIC_MOCK_PROFILE.experience.length
      );
      templateData = buildResumePdfData(GENERIC_MOCK_PROFILE, mockContent);
      filename = `preview-${templateName}`;
    }

    const TemplateComponent = getTemplate(templateName);
    if (!TemplateComponent) {
      return res.status(404).send(`Template "${templateName}" not found`);
    }

    const pdfBuffer = await renderPdfBuffer(TemplateComponent, templateData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}.pdf"`);
    res.status(200).end(pdfBuffer);
  } catch (err) {
    console.error("Preview generation error:", err);
    res.status(500).send("Preview generation failed: " + err.message);
  }
}
