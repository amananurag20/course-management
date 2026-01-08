import React, { useRef, useEffect } from 'react';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from 'react-icons/md';

const RichTextEditor = ({
  content,
  onContentChange,
  placeholder,
  textDirection,
  textAlignment,
  activeFormats,
  onCommandExecute,
  onDirectionToggle,
  isEditing = false,
}) => {
  const editorRef = useRef(null);

  // Preserve caret and prevent rerendering the content unnecessarily
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleCommand = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, null);
    onCommandExecute(command);
    onContentChange(editorRef.current.innerHTML);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    onContentChange(editorRef.current.innerHTML);
  };

  const handleEditorKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false, null);
    }
  };

  useEffect(() => {
    if (editorRef.current && isEditing) {
      editorRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg">
        {[
          { icon: <MdFormatBold size={20} />, command: 'bold', title: 'Bold' },
          { icon: <MdFormatItalic size={20} />, command: 'italic', title: 'Italic' },
          { icon: <MdFormatUnderlined size={20} />, command: 'underline', title: 'Underline' },
          null,
          { icon: <MdFormatListBulleted size={20} />, command: 'insertUnorderedList', title: 'Bullet List' },
          { icon: <MdFormatListNumbered size={20} />, command: 'insertOrderedList', title: 'Numbered List' },
          null,
          { icon: <MdFormatAlignLeft size={20} />, command: 'justifyLeft', title: 'Align Left', align: 'left' },
          { icon: <MdFormatAlignCenter size={20} />, command: 'justifyCenter', title: 'Align Center', align: 'center' },
          { icon: <MdFormatAlignRight size={20} />, command: 'justifyRight', title: 'Align Right', align: 'right' },
        ].map((btn, idx) => {
          if (!btn) return <div key={idx} className="w-px h-6 bg-gray-600" />;

          const isActive =
            btn.command === 'justifyLeft' || btn.command === 'justifyCenter' || btn.command === 'justifyRight'
              ? textAlignment === btn.align
              : activeFormats.has(btn.command);

          return (
            <button
              key={idx}
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand(btn.command);
              }}
              className={`p-2 rounded transition-colors ${
                isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
              title={btn.title}
              type="button"
            >
              {btn.icon}
            </button>
          );
        })}
        <div className="w-px h-6 bg-gray-600"></div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onDirectionToggle();
          }}
          className={`p-2 rounded transition-colors ${
            textDirection === 'rtl'
              ? 'bg-blue-500/20 text-blue-400'
              : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
          }`}
          title={textDirection === 'ltr' ? 'Right to Left' : 'Left to Right'}
          type="button"
        >
          {textDirection === 'ltr' ? 'LTR' : 'RTL'}
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        suppressContentEditableWarning
        ref={editorRef}
        onInput={handleEditorInput}
        onKeyDown={handleEditorKeyDown}
        className="w-full min-h-[120px] bg-gray-700/50 rounded-lg p-4 text-sm text-gray-100 
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 whitespace-pre-wrap break-words editor-content"
        placeholder={placeholder}
        style={{
          direction: textDirection,
          cursor: 'text',
          caretColor: 'white',
          textAlign: textAlignment,
          WebkitUserModify: 'read-write',
          userModify: 'read-write',
        }}
        spellCheck="true"
      />

      <style jsx>{`
        .editor-content {
          position: relative;
          min-height: 120px;
        }
        .editor-content:empty:before {
          content: attr(placeholder);
          position: absolute;
          color: #6B7280;
          pointer-events: none;
        }
        .editor-content[contenteditable='true'] {
          overflow-wrap: break-word;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .editor-content p,
        .editor-content div {
          margin: 0;
          min-height: 1.2em;
        }
        .editor-content:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
