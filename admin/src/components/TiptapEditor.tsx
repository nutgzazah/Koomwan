'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { Extension } from '@tiptap/core';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

// Custom extension to insert tab space
const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.insertContent('&emsp;&emsp;');
        return true;
      },
    };
  },
});

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    content,
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      TabIndent,
    ],
    editorProps: {
      attributes: {
        class: 'min-h-[200px] outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-3 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn-sm">
          <strong>B</strong>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn-sm italic">
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn-sm underline">
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn-sm">
          • Bullets
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn-sm">
          1. Numbered
        </button>
        <button
          onClick={() => {
            const url = prompt('ใส่ลิงก์ (URL)');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className="btn-sm underline"
        >
          🔗 Link
        </button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} className="btn-sm text-red-500">
          ❌ Unlink
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="prose max-w-full" />
    </div>
  );
};

export default TiptapEditor;
