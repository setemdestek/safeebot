// src/lib/cv-builder/__tests__/template-registry.test.ts
import { templates, getTemplateById } from '../template-registry';
import type { CVTemplate } from '@/types/cv';

describe('template-registry', () => {
  describe('templates array', () => {
    it('contains exactly 10 templates', () => {
      expect(templates).toHaveLength(10);
    });

    it('all templates have unique IDs', () => {
      const ids = templates.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all templates have required fields', () => {
      templates.forEach((template: CVTemplate) => {
        expect(template.id).toBeTruthy();
        expect(template.name).toBeTruthy();
        expect(template.description).toBeTruthy();
        expect(template.thumbnailPath).toBeTruthy();
        expect(template.layout).toBeTruthy();
        expect(template.colors).toBeDefined();
        expect(template.colors.primary).toBeTruthy();
        expect(template.colors.secondary).toBeTruthy();
        expect(template.colors.accent).toBeTruthy();
      });
    });

    it('all layouts are valid values', () => {
      const validLayouts = ['single-column', 'two-column', 'sidebar', 'timeline'];
      templates.forEach((template) => {
        expect(validLayouts).toContain(template.layout);
      });
    });
  });

  describe('getTemplateById', () => {
    it('returns the correct template for "azure-professional"', () => {
      const result = getTemplateById('azure-professional');
      expect(result).toBeDefined();
      expect(result!.id).toBe('azure-professional');
      expect(result!.name).toBe('Azure Professional');
      expect(result!.layout).toBe('single-column');
      expect(result!.colors.primary).toBe('#1e40af');
      expect(result!.colors.secondary).toBe('#3b82f6');
      expect(result!.colors.accent).toBe('#dbeafe');
    });

    it('returns undefined for a nonexistent template ID', () => {
      const result = getTemplateById('nonexistent');
      expect(result).toBeUndefined();
    });

    it('returns the correct template for each template ID', () => {
      templates.forEach((template) => {
        const result = getTemplateById(template.id);
        expect(result).toBeDefined();
        expect(result!.id).toBe(template.id);
      });
    });

    it('returns undefined for an empty string ID', () => {
      const result = getTemplateById('');
      expect(result).toBeUndefined();
    });
  });
});
