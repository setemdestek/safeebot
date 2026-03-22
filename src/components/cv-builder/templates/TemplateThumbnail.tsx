'use client';

import { motion } from 'framer-motion';
import type { CVTemplate } from '@/types/cv';

interface TemplateThumbnailProps {
  template: CVTemplate;
  isSelected: boolean;
  onSelect: () => void;
  tabIndex?: number;
}

export default function TemplateThumbnail({ template, isSelected, onSelect, tabIndex = 0 }: TemplateThumbnailProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabIndex={tabIndex}
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`text-left rounded-lg overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Colored placeholder for thumbnail */}
      <div
        className="aspect-[210/297] relative flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: template.colors.accent }}
      >
        <div
          className="w-full h-3 rounded mb-2"
          style={{ backgroundColor: template.colors.primary }}
        />
        <div
          className="w-3/4 h-2 rounded mb-1"
          style={{ backgroundColor: template.colors.secondary, opacity: 0.6 }}
        />
        <div
          className="w-2/3 h-2 rounded mb-3"
          style={{ backgroundColor: template.colors.secondary, opacity: 0.4 }}
        />
        {/* Layout indicator */}
        <div className="flex gap-1 w-full">
          {template.layout === 'two-column' || template.layout === 'sidebar' ? (
            <>
              <div className="flex-1 space-y-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-1.5 rounded" style={{ backgroundColor: template.colors.secondary, opacity: 0.3 }} />
                ))}
              </div>
              <div className={template.layout === 'sidebar' ? 'w-1/3' : 'flex-1'}>
                <div className="space-y-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-1.5 rounded" style={{ backgroundColor: template.colors.primary, opacity: 0.3 }} />
                  ))}
                </div>
              </div>
            </>
          ) : template.layout === 'timeline' ? (
            <div className="flex w-full gap-2">
              <div className="w-0.5 self-stretch rounded" style={{ backgroundColor: template.colors.primary }} />
              <div className="flex-1 space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1.5 rounded" style={{ backgroundColor: template.colors.secondary, opacity: 0.3 }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1.5 rounded" style={{ backgroundColor: template.colors.secondary, opacity: 0.3 }} />
              ))}
            </div>
          )}
        </div>
        <span
          className="absolute bottom-2 text-xs font-medium px-2 py-0.5 rounded"
          style={{ backgroundColor: template.colors.primary, color: template.colors.accent }}
        >
          {template.layout}
        </span>
      </div>
      {/* Template info */}
      <div className="p-3">
        <p className="font-semibold text-sm">{template.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
      </div>
    </motion.button>
  );
}
