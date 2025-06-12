const Course = require("../models/Course");
const sanitizeHtml = require('sanitize-html');

// Allowed HTML tags and attributes for notes
const ALLOWED_TAGS = [
  'p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li',
  'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
];

const ALLOWED_ATTRIBUTES = {
  '*': ['style', 'class']
};

const ALLOWED_STYLES = {
  '*': {
    'text-align': [/^left$/, /^right$/, /^center$/],
    'margin': [/^.*$/],
    'padding': [/^.*$/]
  }
};

// Sanitize HTML content
const sanitizeContent = (content) => {
  return sanitizeHtml(content, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedStyles: ALLOWED_STYLES
  });
};

// Get all notes for a specific resource
exports.getResourceNotes = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex } = req.params;
    const userId = req.user._id;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules[moduleIndex];
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const resource = module.resources[resourceIndex];
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Filter notes to only return the current user's notes
    const notes = (resource.notes || []).filter(note => 
      note.user.toString() === userId.toString()
    );
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

// Add a new note to a resource
exports.addNote = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex } = req.params;
    const { content, timestamp } = req.body;
    const userId = req.user._id;

    // Sanitize HTML content
    const sanitizedContent = sanitizeContent(content);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules[moduleIndex];
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const resource = module.resources[resourceIndex];
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const newNote = {
      user: userId,
      content: sanitizedContent,
      timestamp: timestamp || null,
    };

    if (!resource.notes) {
      resource.notes = [];
    }
    resource.notes.push(newNote);

    await course.save();
    res.status(201).json({ note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex, noteId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Sanitize HTML content
    const sanitizedContent = sanitizeContent(content);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules[moduleIndex];
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const resource = module.resources[resourceIndex];
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const noteIndex = resource.notes.findIndex(
      note => note._id.toString() === noteId && note.user.toString() === userId.toString()
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    resource.notes[noteIndex].content = sanitizedContent;
    resource.notes[noteIndex].updatedAt = Date.now();

    await course.save();
    res.json({ note: resource.notes[noteIndex] });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex, noteId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules[moduleIndex];
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const resource = module.resources[resourceIndex];
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const noteIndex = resource.notes.findIndex(
      note => note._id.toString() === noteId && note.user.toString() === userId.toString()
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    resource.notes.splice(noteIndex, 1);
    await course.save();
    
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
}; 