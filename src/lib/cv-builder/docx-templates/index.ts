// src/lib/cv-builder/docx-templates/index.ts
import type { CVFormData } from '@/types/cv';
import type { CVLabels } from '../cv-labels';
import type { Document } from 'docx';

import { buildAzureProfessionalDocx } from './azure-professional';
import { buildPearlClassicDocx } from './pearl-classic';
import { buildMidnightModernDocx } from './midnight-modern';
import { buildRoseElegantDocx } from './rose-elegant';
import { buildNordicMinimalDocx } from './nordic-minimal';
import { buildCarbonExecutiveDocx } from './carbon-executive';
import { buildOceanSidebarDocx } from './ocean-sidebar';
import { buildEmeraldTimelineDocx } from './emerald-timeline';
import { buildSlateTwoColumnDocx } from './slate-two-column';
import { buildCoralCreativeDocx } from './coral-creative';

type DocxBuilder = (data: CVFormData, photoBuffer: Buffer | null, labels: CVLabels) => Document;

const builders: Record<string, DocxBuilder> = {
  'azure-professional': buildAzureProfessionalDocx,
  'pearl-classic': buildPearlClassicDocx,
  'midnight-modern': buildMidnightModernDocx,
  'rose-elegant': buildRoseElegantDocx,
  'nordic-minimal': buildNordicMinimalDocx,
  'carbon-executive': buildCarbonExecutiveDocx,
  'ocean-sidebar': buildOceanSidebarDocx,
  'emerald-timeline': buildEmeraldTimelineDocx,
  'slate-two-column': buildSlateTwoColumnDocx,
  'coral-creative': buildCoralCreativeDocx,
};

export function getDocxBuilder(templateId: string): DocxBuilder {
  const builder = builders[templateId];
  if (!builder) throw new Error(`Unknown template: ${templateId}`);
  return builder;
}

export type { DocxBuilder };
