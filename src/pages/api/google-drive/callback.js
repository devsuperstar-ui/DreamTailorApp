import { createOAuth2Client } from "@/lib/google-drive";

/**
 * GET — OAuth callback after signing in with personal Gmail.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const code = req.query.code;
  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing authorization code. Open /api/google-drive/auth to try again.");
  }

  try {
    const client = createOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).send(
        "No refresh token returned. Revoke this app at https://myaccount.google.com/permissions " +
          "then open /api/google-drive/auth again."
      );
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>My Drive connected</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; line-height: 1.5;">
  <h1>Personal Gmail / My Drive connected</h1>
  <p>Add this line to your <code>.env</code> file, then restart <code>npm run dev</code>:</p>
  <pre style="background: #f1f5f9; padding: 16px; overflow-x: auto; border-radius: 8px; font-size: 13px;">GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}</pre>
  <p><strong>GOOGLE_DRIVE_FOLDER_ID</strong> should be a folder in <strong>My Drive</strong> (open the folder in Drive and copy the ID from the URL).</p>
  <p>You can remove <code>GOOGLE_CLIENT_EMAIL</code> and <code>GOOGLE_PRIVATE_KEY</code> — they are not used for personal Gmail.</p>
  <p><a href="/">Back to app</a></p>
</body>
</html>`);
  } catch (err) {
    console.error("[google-drive/callback]", err);
    res.status(500).send("OAuth failed: " + (err.message || String(err)));
  }
}
