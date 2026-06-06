import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function getResumePath(name) {
  return path.join(DATA_DIR, "resumes", `${name}.json`);
}

export const defaultPromptPath = path.join(DATA_DIR, "prompts", "default.txt");
