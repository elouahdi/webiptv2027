'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useMemo } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Rows3 as RowsIcon,
  Columns3 as ColumnsIcon,
  SeparatorHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* ───────────────────────────── Types ───────────────────────────── */

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

/* ──────────────────────── ToolbarButton ────────────────────────── */

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150',
        'text-[var(--admin-text-secondary)]',
        disabled && 'opacity-35 cursor-not-allowed',
        !disabled && !active && 'hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]',
        active && 'bg-[var(--brand-from)]/15 text-[var(--brand-from)]',
      )}
    >
      {children}
    </button>
  );
}

/* ──────────────────── ToolbarDivider ───────────────────────────── */

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[var(--admin-border)] mx-1 shrink-0" />;
}

/* ──────────────────── TableContextBar ─────────────────────────── */

function TableContextBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const items: { label: string; icon: React.ReactNode; action: () => void }[] = [
    {
      label: 'Col avant',
      icon: <ColumnsIcon className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: 'Col après',
      icon: <ColumnsIcon className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: 'Suppr. col',
      icon: <Minus className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      label: 'Ligne avant',
      icon: <RowsIcon className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: 'Ligne après',
      icon: <RowsIcon className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: 'Suppr. ligne',
      icon: <Minus className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: 'Fusionner',
      icon: <Plus className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().mergeCells().run(),
    },
    {
      label: 'Diviser',
      icon: <Minus className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().splitCell().run(),
    },
    {
      label: 'Suppr. tableau',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().deleteTable().run(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-[var(--admin-border)] bg-[var(--admin-muted)]/25">
      <span className="text-[11px] font-medium text-[var(--admin-text-muted)] mr-1.5 uppercase tracking-wider">
        Tableau
      </span>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.action}
          title={item.label}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium',
            'text-[var(--admin-text-secondary)] transition-all duration-150',
            'hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]',
            item.label === 'Suppr. tableau' && 'hover:bg-red-500/10 hover:text-red-400',
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ──────────────────── Main Editor ─────────────────────────────── */

export function TiptapEditor({ content, onChange, placeholder, className }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'admin-editor-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[var(--brand-from)] underline decoration-[var(--brand-from)]/40 hover:decoration-[var(--brand-from)] transition-colors' },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Commencez à écrire...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[400px] px-6 py-5 focus:outline-none admin-editor-content',
        style: 'font-family: Inter, system-ui, -apple-system, sans-serif; line-height: 1.75;',
      },
    },
  });

  /* ── Stats ── */
  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0 };
    const text = editor.state.doc.textContent;
    const trimmed = text.trim();
    return {
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: text.length,
    };
  }, [editor, editor?.state.doc.textContent]);

  if (!editor) return null;

  /* ── Actions ── */
  const addLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien:', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  /* ── Block type detection ── */
  const getCurrentBlockType = (): string => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('blockquote')) return 'blockquote';
    if (editor.isActive('codeBlock')) return 'codeBlock';
    return 'paragraph';
  };

  const setBlockType = (type: string) => {
    switch (type) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  };

  const isInTable = editor.isActive('table');

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--admin-border)] overflow-hidden bg-[var(--admin-input)]',
        'shadow-sm',
        className,
      )}
    >
      {/* ── Main Toolbar ── */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2.5 py-2 border-b border-[var(--admin-border)] bg-[var(--admin-muted)]/40 backdrop-blur-sm">
        {/* Section 1: Block Type Selector */}
        <select
          value={getCurrentBlockType()}
          onChange={(e) => setBlockType(e.target.value)}
          className={cn(
            'h-8 px-2.5 pr-7 rounded-md text-[13px] font-medium',
            'bg-[var(--admin-input)] border border-[var(--admin-border)]',
            'text-[var(--admin-text)] cursor-pointer',
            'transition-all duration-150',
            'hover:border-[var(--brand-from)]/50',
            'focus:outline-none focus:ring-1 focus:ring-[var(--brand-from)]/40 focus:border-[var(--brand-from)]/50',
            'appearance-none',
            'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239898a8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:12px] bg-[right_6px_center] bg-no-repeat',
          )}
        >
          <option value="paragraph">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
          <option value="blockquote">Citation</option>
          <option value="codeBlock">Code</option>
        </select>

        <ToolbarDivider />

        {/* Section 2: Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annuler (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rétablir (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Section 3: Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Gras (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italique (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Souligné (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Barré"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code inline"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Section 4: Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Section 5: Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Aligner à gauche"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centrer"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Aligner à droite"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Section 6: Insert */}
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Insérer un lien"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addImage}
          title="Insérer une image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertTable}
          title="Insérer un tableau (3×3)"
        >
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Ligne horizontale"
        >
          <SeparatorHorizontal className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* ── Table Context Bar ── */}
      {isInTable && <TableContextBar editor={editor} />}

      {/* ── Editor Content ── */}
      <EditorContent editor={editor} />

      {/* ── Footer Stats Bar ── */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[var(--admin-border)] bg-[var(--admin-muted)]/20">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--admin-text-muted)]">
            {stats.words} {stats.words === 1 ? 'mot' : 'mots'}
          </span>
          <span className="text-[11px] text-[var(--admin-text-muted)] opacity-40">•</span>
          <span className="text-[11px] text-[var(--admin-text-muted)]">
            {stats.chars} {stats.chars === 1 ? 'caractère' : 'caractères'}
          </span>
        </div>
        <span className="text-[11px] text-[var(--admin-text-muted)] opacity-50">
          Tiptap
        </span>
      </div>
    </div>
  );
}
