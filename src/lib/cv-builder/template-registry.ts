// src/lib/cv-builder/template-registry.ts
import type { CVTemplate } from '@/types/cv';

export const templates: CVTemplate[] = [
  {
    id: 'azure-professional',
    name: 'Azure Professional',
    description: 'Corporate, ATS-friendly — blue gradient header, clean layout',
    thumbnailPath: '/images/cv-templates/azure-professional.png',
    layout: 'single-column',
    colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe' },
  },
  {
    id: 'midnight-modern',
    name: 'Midnight Modern',
    description: 'Tech-modern — black sidebar, neon accent, skill bars',
    thumbnailPath: '/images/cv-templates/midnight-modern.png',
    layout: 'sidebar',
    colors: { primary: '#0f172a', secondary: '#1e293b', accent: '#38bdf8' },
  },
  {
    id: 'rose-elegant',
    name: 'Rose Elegant',
    description: 'Refined, aesthetic — pastel pink/beige, serif fonts',
    thumbnailPath: '/images/cv-templates/rose-elegant.png',
    layout: 'single-column',
    colors: { primary: '#9f1239', secondary: '#fecdd3', accent: '#fff1f2' },
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Minimal',
    description: 'Scandinavian minimalism — lots of whitespace, thin accent',
    thumbnailPath: '/images/cv-templates/nordic-minimal.png',
    layout: 'single-column',
    colors: { primary: '#374151', secondary: '#9ca3af', accent: '#f9fafb' },
  },
  {
    id: 'carbon-executive',
    name: 'Carbon Executive',
    description: 'C-level, authoritative — charcoal header, gold accent',
    thumbnailPath: '/images/cv-templates/carbon-executive.png',
    layout: 'single-column',
    colors: { primary: '#1c1917', secondary: '#44403c', accent: '#d97706' },
  },
  {
    id: 'ocean-sidebar',
    name: 'Ocean Sidebar',
    description: 'Compact, information-dense — deep blue sidebar with photo',
    thumbnailPath: '/images/cv-templates/ocean-sidebar.png',
    layout: 'sidebar',
    colors: { primary: '#0c4a6e', secondary: '#0369a1', accent: '#e0f2fe' },
  },
  {
    id: 'emerald-timeline',
    name: 'Emerald Timeline',
    description: 'Experience-focused — green timeline line on left',
    thumbnailPath: '/images/cv-templates/emerald-timeline.png',
    layout: 'timeline',
    colors: { primary: '#065f46', secondary: '#059669', accent: '#d1fae5' },
  },
  {
    id: 'slate-two-column',
    name: 'Slate Two-Column',
    description: 'Balanced, structured — equal 2 columns, gray-blue palette',
    thumbnailPath: '/images/cv-templates/slate-two-column.png',
    layout: 'two-column',
    colors: { primary: '#334155', secondary: '#64748b', accent: '#f1f5f9' },
  },
  {
    id: 'coral-creative',
    name: 'Coral Creative',
    description: 'Creative fields — non-standard layout, coral accent',
    thumbnailPath: '/images/cv-templates/coral-creative.png',
    layout: 'two-column',
    colors: { primary: '#c2410c', secondary: '#f97316', accent: '#fff7ed' },
  },
  {
    id: 'pearl-classic',
    name: 'Pearl Classic',
    description: 'Universal professional — subtle beige, serif+sans-serif mix',
    thumbnailPath: '/images/cv-templates/pearl-classic.png',
    layout: 'single-column',
    colors: { primary: '#44403c', secondary: '#78716c', accent: '#faf5f0' },
  },
];

export function getTemplateById(id: string): CVTemplate | undefined {
  return templates.find((t) => t.id === id);
}
