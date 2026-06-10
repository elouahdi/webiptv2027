'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { PageBlock, PageBlockType } from '@/lib/cms/types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils/cn';

const BLOCK_TYPES: { value: PageBlockType; label: string }[] = [
  { value: 'hero', label: 'Hero' },
  { value: 'text', label: 'Texte' },
  { value: 'image', label: 'Image' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'features', label: 'Fonctionnalités' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact-form', label: 'Formulaire contact' },
  { value: 'gallery', label: 'Galerie' },
];

function SortableBlock({
  block,
  onUpdate,
  onRemove,
  isExpanded,
  onToggle,
}: {
  block: PageBlock;
  onUpdate: (content: Record<string, unknown>) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockLabel = BLOCK_TYPES.find((t) => t.value === block.type)?.label || block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border border-admin-border rounded-lg bg-admin-card',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-center gap-2 p-3 border-b border-admin-border">
        <button
          type="button"
          className="cursor-grab text-admin-text-muted hover:text-admin-text"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="flex-1 text-sm font-medium text-admin-text">{blockLabel}</span>
        <button type="button" onClick={onToggle} className="p-1 text-admin-text-muted hover:text-admin-text">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button type="button" onClick={onRemove} className="p-1 text-red-400 hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {block.type === 'hero' && (
            <>
              <Input
                label="Titre"
                value={(block.content.title as string) || ''}
                onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
              />
              <Input
                label="Sous-titre"
                value={(block.content.subtitle as string) || ''}
                onChange={(e) => onUpdate({ ...block.content, subtitle: e.target.value })}
              />
            </>
          )}
          {block.type === 'text' && (
            <Textarea
              label="Contenu HTML"
              value={(block.content.body as string) || ''}
              onChange={(e) => onUpdate({ ...block.content, body: e.target.value })}
              rows={6}
            />
          )}
          {block.type === 'cta' && (
            <>
              <Input
                label="Titre"
                value={(block.content.title as string) || ''}
                onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
              />
              <Input
                label="Bouton texte"
                value={(block.content.buttonText as string) || ''}
                onChange={(e) => onUpdate({ ...block.content, buttonText: e.target.value })}
              />
              <Input
                label="Bouton URL"
                value={(block.content.buttonUrl as string) || ''}
                onChange={(e) => onUpdate({ ...block.content, buttonUrl: e.target.value })}
              />
            </>
          )}
          {(block.type === 'image' || block.type === 'gallery') && (
            <Input
              label="URL de l'image"
              value={(block.content.imageUrl as string) || ''}
              onChange={(e) => onUpdate({ ...block.content, imageUrl: e.target.value })}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface PageBuilderProps {
  sections: PageBlock[];
  onChange: (sections: PageBlock[]) => void;
}

export function PageBuilder({ sections, onChange }: PageBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newBlockType, setNewBlockType] = useState<PageBlockType>('text');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }));
      onChange(reordered);
    }
  };

  const addBlock = () => {
    const block: PageBlock = {
      id: uuidv4(),
      type: newBlockType,
      order: sections.length,
      content: {},
    };
    onChange([...sections, block]);
    setExpandedId(block.id);
  };

  const updateBlock = (id: string, content: Record<string, unknown>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  const removeBlock = (id: string) => {
    onChange(sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(content) => updateBlock(block.id, content)}
                onRemove={() => removeBlock(block.id)}
                isExpanded={expandedId === block.id}
                onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <Card className="p-8 text-center text-admin-text-muted">
          Aucun bloc. Ajoutez votre premier bloc ci-dessous.
        </Card>
      )}

      <div className="flex gap-3 items-end">
        <Select
          label="Type de bloc"
          value={newBlockType}
          onChange={(e) => setNewBlockType(e.target.value as PageBlockType)}
          options={BLOCK_TYPES}
        />
        <Button type="button" onClick={addBlock} className="mb-0.5">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>
    </div>
  );
}
