import fs from "fs";
import { getPromptForProfile } from "./profile-template-mapping";
import { getPromptPath, defaultPromptPath } from "./paths";
import { applyPromptVariables } from "./profile-prompt";
import { appendAtsBlock } from "./ats-prompt-block";

export function loadPromptTemplateForProfile(profileSlug) {
  const promptName = getPromptForProfile(profileSlug);
  const specific = getPromptPath(promptName);
  const fallback = defaultPromptPath;
  const filePath = fs.existsSync(specific) ? specific : fallback;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file missing: ${filePath}`);
  }
  if (!fs.existsSync(specific)) {
    console.log(`Using default prompt (${promptName}.txt not found)`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function loadPromptForProfile(profileSlug, variables) {
  const template = loadPromptTemplateForProfile(profileSlug);
  return appendAtsBlock(applyPromptVariables(template, variables));
}

export { buildPromptVariables, buildManualPrompt } from "./profile-prompt";
