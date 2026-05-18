import { getGoogleDriveStatus } from "@/lib/google-drive";

/** GET — whether My Drive upload is ready (for UI). */
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.status(200).json(getGoogleDriveStatus());
}
