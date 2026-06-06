import fs from "fs";
import { defaultPromptPath } from "./paths";
import { applyPromptVariables } from "./profile-prompt";
import { finalizeResumePrompt } from "./ats-prompt-block";

export function loadPromptTemplateForProfile(_profileSlug) {
  if (!fs.existsSync(defaultPromptPath)) {
    throw new Error(`Prompt file missing: ${defaultPromptPath}`);
  }
  return fs.readFileSync(defaultPromptPath, "utf-8");
}

export function loadPromptForProfile(profileSlug, variables) {
  const template = loadPromptTemplateForProfile(profileSlug);
  return finalizeResumePrompt(applyPromptVariables(template, variables));
}

export { buildPromptVariables, buildManualPrompt } from "./profile-prompt";
