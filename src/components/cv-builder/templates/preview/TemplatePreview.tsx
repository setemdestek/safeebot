'use client';

import { lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';

const templateComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'azure-professional': lazy(() => import('./AzureProfessional')),
  'midnight-modern': lazy(() => import('./MidnightModern')),
  'rose-elegant': lazy(() => import('./RoseElegant')),
  'nordic-minimal': lazy(() => import('./NordicMinimal')),
  'carbon-executive': lazy(() => import('./CarbonExecutive')),
  'ocean-sidebar': lazy(() => import('./OceanSidebar')),
  'emerald-timeline': lazy(() => import('./EmeraldTimeline')),
  'slate-two-column': lazy(() => import('./SlateTwoColumn')),
  'coral-creative': lazy(() => import('./CoralCreative')),
  'pearl-classic': lazy(() => import('./PearlClassic')),
};

interface TemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatePreview({ isOpen, onClose }: TemplatePreviewProps) {
  const { state } = useCVFormContext();
  const TemplateComponent = templateComponents[state.templateId];

  return (
    <AnimatePresence>
      {isOpen && TemplateComponent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2.5 shadow hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
              <TemplateComponent />
            </Suspense>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
