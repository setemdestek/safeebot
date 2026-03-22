'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DynamicListFieldProps<T extends { id: string }> {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel: string;
  title: string;
  maxItems?: number;
}

export default function DynamicListField<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
  title,
  maxItems = 10,
}: DynamicListFieldProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {items.length < maxItems && (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative border rounded-lg p-4 space-y-3"
          >
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute top-3 right-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {addLabel} düyməsinə basaraq əlavə edin
        </p>
      )}
    </div>
  );
}
