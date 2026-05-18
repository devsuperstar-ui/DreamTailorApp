import { Readable } from "stream";
import { google } from "googleapis";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export function isGoogleDriveConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_EMAIL?.trim() &&
      process.env.GOOGLE_PRIVATE_KEY?.trim() &&
      process.env.GOOGLE_DRIVE_FOLDER_ID?.trim()
  );
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
}

function getDriveClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: getPrivateKey(),
    scopes: [DRIVE_SCOPE],
  });
  return google.drive({ version: "v3", auth });
}

/**
 * Upload a PDF to the configured Drive folder and return a shareable view link.
 * @param {Buffer} pdfBuffer
 * @param {string} fileName
 * @returns {Promise<{ fileId: string, url: string }>}
 */
export async function uploadPdfToGoogleDrive(pdfBuffer, fileName) {
  if (!isGoogleDriveConfigured()) {
    throw new Error(
      "Google Drive is not configured. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID."
    );
  }

  const drive = getDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID.trim();
  const body = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: "application/pdf",
      body: Readable.from(body),
    },
    fields: "id",
    supportsAllDrives: true,
  });

  const fileId = created.data.id;
  if (!fileId) {
    throw new Error("Google Drive upload failed: no file id returned");
  }

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
    supportsAllDrives: true,
  });

  const file = await drive.files.get({
    fileId,
    fields: "webViewLink",
    supportsAllDrives: true,
  });

  const url = file.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
  return { fileId, url };
}
