const Note = require("../models/note");
const mongoose = require("mongoose");

const createNote = async (req, res) => {
  try {
    const newNote = new Note({
      user: req.user.userId,
      ...req.body,
    });

    const createdNote = await newNote.save();

    res.status(201).json(createdNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Note" });
  }
};

const createNoteV2 = async (req, res) => {
  try {
    const newNote = new Note({
      user: req.user.userId,
      ...req.body,
    });

    const createdNote = await newNote.save();

    res.status(201).json({ success: true, data: createdNote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Note" });
  }
};

const updateNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId).populate("user");
    if (note.user.id !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Note.deleteMany({
      user: req.user.userId,
      question: req.body.question,
      _id: {
        $ne: new mongoose.Types.ObjectId(noteId),
      },
    });

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating Note" });
  }
};

const updateNoteV2 = async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId).populate("user");
    if (note.user.id !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Note.deleteMany({
      user: req.user.userId,
      question: req.body.question,
      _id: {
        $ne: new mongoose.Types.ObjectId(noteId),
      },
    });

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating Note" });
  }
};
const getNote = async (req, res) => {
  const userId = req.user.userId;
  const questionId = req.query.question;
  if (!questionId) {
    return res
      .status(400)
      .json({ error: "Missing Question Id in query Params" });
  }
  try {
    const note = await Note.findOne({
      question: questionId,
      user: userId,
    });
    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching Note" });
  }
};

const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    // Find the note by ID and populate the user field
    const note = await Note.findById(noteId).populate("user");

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the note belongs to the current user
    if (note.user.id !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the note
    await Note.findByIdAndDelete(noteId);

    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Note" });
  }
};
const deleteAllNotesOfUser = async (req, res) => {
  try {
    const userId = req.query.user; // Get the authenticated user's ID

    // Delete all notes belonging to the user
    const deleteResult = await Note.deleteMany({ user: userId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "No notes found for this user" });
    }

    res.status(200).json({ success: true, message: "All notes deleted successfully" });
  } catch (error) {
    console.error("Error deleting notes:", error);
    res.status(500).json({ error: "Error deleting notes" });
  }
};


const deleteNoteV2 = async (req, res) => {
  const noteId = req.params.id;

  try {
    // Find the note by ID and populate the user field
    const note = await Note.findById(noteId).populate("user");

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the note belongs to the current user
    if (note.user.id !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the note
    await Note.findByIdAndDelete(noteId);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting Note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    // Get page and limit from query params (default values: page = 1, limit = 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Note.countDocuments({ user: userId });

    // Fetch notes with pagination
    const notes = await Note.aggregate([
      {
        $match: { user: userId },
      },
      {
        $project: {
          note: 1,
          question: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by latest notes
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: notes,
    });
  } catch (error) {
    console.error("Error getting notes by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
  createNoteV2,
  updateNoteV2,
  deleteNoteV2,
  deleteAllNotesOfUser,
};
