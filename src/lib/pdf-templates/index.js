import ResumeTemplate from './ResumeTemplate';
import { ResumeTechTeal } from './templates/ResumeTechTeal';
import { ResumeModernGreen } from './templates/ResumeModernGreen';
import { ResumeCreativeBurgundy } from './templates/ResumeCreativeBurgundy';
import { ResumeBoldEmerald } from './templates/ResumeBoldEmerald';
import { ResumeCorporateSlate } from './templates/ResumeCorporateSlate';
import { ResumeExecutiveNavy } from './templates/ResumeExecutiveNavy';
import { ResumeClassicCharcoal } from './templates/ResumeClassicCharcoal';
import { ResumeConsultantSteel } from './templates/ResumeConsultantSteel';
import { ResumeAcademicPurple } from './templates/ResumeAcademicPurple';

const templates = {
  'Resume': ResumeTemplate,
  'Resume-Tech-Teal': ResumeTechTeal,
  'Resume-Modern-Green': ResumeModernGreen,
  'Resume-Creative-Burgundy': ResumeCreativeBurgundy,
  'Resume-Bold-Emerald': ResumeBoldEmerald,
  'Resume-Corporate-Slate': ResumeCorporateSlate,
  'Resume-Executive-Navy': ResumeExecutiveNavy,
  'Resume-Classic-Charcoal': ResumeClassicCharcoal,
  'Resume-Consultant-Steel': ResumeConsultantSteel,
  'Resume-Academic-Purple': ResumeAcademicPurple,
};

const templateLoaders = {
  'Resume': () => import('./ResumeTemplate').then((m) => m.default),
  'Resume-Tech-Teal': () => import('./templates/ResumeTechTeal').then((m) => m.ResumeTechTeal),
  'Resume-Modern-Green': () => import('./templates/ResumeModernGreen').then((m) => m.ResumeModernGreen),
  'Resume-Creative-Burgundy': () => import('./templates/ResumeCreativeBurgundy').then((m) => m.ResumeCreativeBurgundy),
  'Resume-Bold-Emerald': () => import('./templates/ResumeBoldEmerald').then((m) => m.ResumeBoldEmerald),
  'Resume-Corporate-Slate': () => import('./templates/ResumeCorporateSlate').then((m) => m.ResumeCorporateSlate),
  'Resume-Executive-Navy': () => import('./templates/ResumeExecutiveNavy').then((m) => m.ResumeExecutiveNavy),
  'Resume-Classic-Charcoal': () => import('./templates/ResumeClassicCharcoal').then((m) => m.ResumeClassicCharcoal),
  'Resume-Consultant-Steel': () => import('./templates/ResumeConsultantSteel').then((m) => m.ResumeConsultantSteel),
  'Resume-Academic-Purple': () => import('./templates/ResumeAcademicPurple').then((m) => m.ResumeAcademicPurple),
};

export const getTemplate = (templateId) => {
  const templateName = templateId || 'Resume';
  return templates[templateName] || templates['Resume'];
};

/** Load only the template needed for this request (faster cold start in dev). */
export async function getTemplateAsync(templateId) {
  const templateName = templateId || 'Resume';
  const load = templateLoaders[templateName] || templateLoaders['Resume'];
  return load();
}

export default templates;
