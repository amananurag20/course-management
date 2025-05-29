import React, { useState } from 'react';
import { MdNoteAdd, MdTimer, MdClose, MdEdit, MdDelete, MdSave } from 'react-icons/md';
import RichTextEditor from './RichTextEditor';

const Notes = ({
  notes,
  currentVideoTime,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onSeekToTimestamp,
  formatTimestamp,
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [editingTimestamp, setEditingTimestamp] = useState(false);
  const [timestampInput, setTimestampInput] = useState("");
  const [textDirection, setTextDirection] = useState('ltr');
  const [textAlignment, setTextAlignment] = useState('left');
  const [activeFormats, setActiveFormats] = useState(new Set());

  // Function to check if format is active
  const isFormatActive = (command) => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };

  // Function to check text alignment
  const checkTextAlignment = () => {
    if (isFormatActive('justifyCenter')) return 'center';
    if (isFormatActive('justifyRight')) return 'right';
    return 'left';
  };

  // Function to update active formats
  const updateActiveFormats = () => {
    const formats = new Set();
    ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].forEach(format => {
      if (isFormatActive(format)) {
        formats.add(format);
      }
    });
    setActiveFormats(formats);
    setTextAlignment(checkTextAlignment());
  };

  // Function to handle editor command
  const handleEditorCommand = (command) => {
    if (command.startsWith('justify')) {
      setTextAlignment(command === 'justifyLeft' ? 'left' : command === 'justifyCenter' ? 'center' : 'right');
    }
    // Let the format update happen naturally through the editor's onInput event
  };

  // Function to toggle text direction
  const toggleTextDirection = () => {
    setTextDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');
  };

  // Function to handle timestamp input change
  const handleTimestampChange = (e) => {
    const value = e.target.value;
    if (value.length <= 5) {
      setTimestampInput(value);
    }
  };

  // Function to handle timestamp input blur
  const handleTimestampBlur = () => {
    if (/^[0-9]{1,2}:[0-5][0-9]$/.test(timestampInput)) {
      const [minutes, seconds] = timestampInput.split(":").map(Number);
      if (!isNaN(minutes) && !isNaN(seconds) && seconds < 60) {
        const totalSeconds = minutes * 60 + seconds;
        setCurrentVideoTime(totalSeconds);
      }
    }
    setEditingTimestamp(false);
  };

  // Function to handle note content change
  const handleContentChange = (content) => {
    if (editingNoteId) {
      setEditingContent(content);
    } else {
      setEditorContent(content);
    }
    // Update formats after content change
    requestAnimationFrame(updateActiveFormats);
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <MdNoteAdd className="mr-2" />
          Notes
        </h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 
            rounded-lg transition-all duration-200 flex items-center"
        >
          <MdNoteAdd className="mr-2" /> Add Note
        </button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="mb-6 bg-gray-700/30 rounded-lg p-4">
          <RichTextEditor
            content={editorContent}
            onContentChange={handleContentChange}
            placeholder="Write your note here..."
            textDirection={textDirection}
            textAlignment={textAlignment}
            activeFormats={activeFormats}
            onCommandExecute={handleEditorCommand}
            onDirectionToggle={toggleTextDirection}
          />

          {/* Timestamp Section */}
          <div className="flex items-center space-x-2 mt-4">
            {includeTimestamp ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1.5 rounded-lg">
                  <MdTimer className="text-blue-400" />
                  {editingTimestamp ? (
                    <input
                      type="text"
                      value={timestampInput}
                      onChange={handleTimestampChange}
                      onBlur={handleTimestampBlur}
                      className="w-16 bg-transparent text-blue-400 text-center focus:outline-none"
                      placeholder="mm:ss"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTimestamp(true);
                        setTimestampInput(formatTimestamp(currentVideoTime));
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Click to edit timestamp"
                    >
                      {formatTimestamp(currentVideoTime)}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIncludeTimestamp(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors p-1.5 hover:bg-gray-600/50 rounded-lg"
                  title="Remove timestamp"
                >
                  <MdClose size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIncludeTimestamp(true);
                  setTimestampInput(formatTimestamp(currentVideoTime));
                }}
                className="flex items-center px-3 py-1.5 rounded-lg transition-colors
                  bg-gray-600/50 text-gray-400 hover:bg-gray-600/70 hover:text-gray-300"
              >
                <MdTimer className="mr-1.5" />
                Add Timestamp
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setIsAddingNote(false);
                setEditorContent("");
                setActiveFormats(new Set());
                setTextAlignment('left');
              }}
              className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 
                text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAddNote({
                  content: editorContent,
                  includeTimestamp,
                  timestamp: includeTimestamp ? currentVideoTime : null
                });
                setIsAddingNote(false);
                setEditorContent("");
                setActiveFormats(new Set());
                setTextAlignment('left');
              }}
              disabled={!editorContent.trim()}
              className={`px-4 py-2 rounded-lg transition-colors
                ${!editorContent.trim() 
                  ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'}`}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-gray-700/30 rounded-lg p-4 transition-all duration-200 hover:bg-gray-700/40">
            {editingNoteId === note._id ? (
              <div className="space-y-3">
                <RichTextEditor
                  content={editingContent}
                  onContentChange={handleContentChange}
                  placeholder="Edit your note..."
                  textDirection={textDirection}
                  textAlignment={textAlignment}
                  activeFormats={activeFormats}
                  onCommandExecute={handleEditorCommand}
                  onDirectionToggle={toggleTextDirection}
                  isEditing={true}
                />
                
                {/* Edit Mode Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditingContent("");
                      setActiveFormats(new Set());
                      setTextAlignment('left');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-600/50 hover:bg-gray-600/70 
                      text-gray-300 text-sm flex items-center"
                  >
                    <MdClose className="mr-1.5" /> Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateNote(note._id, editingContent);
                      setEditingNoteId(null);
                      setEditingContent("");
                      setActiveFormats(new Set());
                      setTextAlignment('left');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                      text-blue-400 text-sm flex items-center"
                  >
                    <MdSave className="mr-1.5" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-400 flex items-center">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.timestamp !== null && (
                      <button
                        onClick={() => onSeekToTimestamp(note.timestamp)}
                        className="ml-2 flex items-center text-blue-400 hover:text-blue-300 
                          transition-colors px-2 py-0.5 rounded hover:bg-blue-500/10 group cursor-pointer"
                        title="Click to jump to this time in the video"
                      >
                        <MdTimer className="mr-1 group-hover:animate-pulse" />
                        {formatTimestamp(note.timestamp)}
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingNoteId(note._id);
                        setEditingContent(note.content);
                        setTextDirection('ltr');
                        setActiveFormats(new Set());
                        setTextAlignment('left');
                      }}
                      className="p-1.5 rounded hover:bg-gray-600/50 text-gray-400 
                        hover:text-gray-300 transition-colors"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note._id)}
                      className="p-1.5 rounded hover:bg-gray-600/50 text-gray-400 
                        hover:text-red-400 transition-colors"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
                <div 
                  className="text-gray-200 text-sm"
                  style={{ direction: 'ltr' }}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes; 