"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils";
import { Bold, Italic, List, AlignLeft, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Type here...",
  className,
  minHeight = 80,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    onChange?.(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

  const toolbarBtns = [
    { icon: <Undo className="w-3.5 h-3.5" />, cmd: "undo" },
    { icon: <Redo className="w-3.5 h-3.5" />, cmd: "redo" },
    { icon: <Bold className="w-3.5 h-3.5" />, cmd: "bold" },
    { icon: <Italic className="w-3.5 h-3.5" />, cmd: "italic" },
    { icon: <AlignLeft className="w-3.5 h-3.5" />, cmd: "justifyLeft" },
    { icon: <List className="w-3.5 h-3.5" />, cmd: "insertUnorderedList" },
  ];

  return (
    <div className={cn("border border-slate-200 rounded-lg overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50">
        {toolbarBtns.map((btn, i) => (
          <button
            key={i}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec(btn.cmd);
            }}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
          >
            {btn.icon}
          </button>
        ))}
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => exec("formatBlock", e.target.value)}
          className="text-xs bg-transparent text-slate-600 border-none outline-none cursor-pointer"
          defaultValue="p"
        >
          <option value="p">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange?.(editorRef.current?.innerHTML ?? "")}
        className="px-3 py-2 text-sm text-slate-700 outline-none overflow-auto
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
        style={{ minHeight }}
      />
    </div>
  );
}
