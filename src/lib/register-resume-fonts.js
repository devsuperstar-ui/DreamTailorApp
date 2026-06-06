import path from "path";
import { Font } from "@react-pdf/renderer";
import { RESUME_FONT_FAMILY } from "./resume-font-family";

export { RESUME_FONT_FAMILY };

let registered = false;

const FONT_DIR = path.join(process.cwd(), "data", "fonts", "source-sans-3");

function fontPath(fileName) {
  return path.join(FONT_DIR, fileName);
}

/** Register Source Sans 3 for PDF rendering (idempotent). */
export function registerResumeFonts() {
  if (registered) return;

  Font.register({
    family: RESUME_FONT_FAMILY,
    fonts: [
      {
        src: fontPath("source-sans-3-latin-ext-400-normal.woff"),
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: fontPath("source-sans-3-latin-ext-600-normal.woff"),
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: fontPath("source-sans-3-latin-ext-700-normal.woff"),
        fontWeight: 700,
        fontStyle: "normal",
      },
      {
        src: fontPath("source-sans-3-latin-ext-400-italic.woff"),
        fontWeight: 400,
        fontStyle: "italic",
      },
    ],
  });

  registered = true;
}
