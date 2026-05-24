import { buildTemplateCatalog } from "@/lib/template-catalog-server";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    res.status(200).json(buildTemplateCatalog());
  } catch (error) {
    console.error("Template catalog error:", error);
    res.status(500).json({ error: "Failed to build template catalog" });
  }
}
