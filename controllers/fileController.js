const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const fs = require("fs");

// Function to create storage for different types of files
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `uploads/${folderName}/`;
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          return cb(err, null);
        }
        cb(null, uploadPath);
      });
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
};

// File filter for documents (PDF, Word)
const documentFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only PDF, DOC, and DOCX files are allowed!");
  }
};

// Multer instance for document uploads
const uploadDoc = multer({
  storage: createStorage("documents"),
  fileFilter: documentFilter,
}).single("document");

// Upload document handler
const uploadDocument = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadDoc(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return res.status(400).send({ message: "No document selected" });
    }

    const fileUrl = req.file.path.replace(/\\/g, "/");
    const newFile = new File({
      url: fileUrl,
      type: req.file.mimetype,
      size: req.file.size,
    });

    await newFile.save();

    res.send({
      success: true,
      data: newFile,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred during document upload or database operation",
      error: err,
    });
  }
};


const deletePath = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found" });
    }
    const baseUrl = process.env.BASE_URL;
    const filePath = file.url.replace(baseUrl, "");

    await deletePath(filePath);

    await File.findByIdAndDelete(fileId);

    res.send({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred during deletion",
      error: err,
    });
  }
};


module.exports = {
  uploadDocument, // Add the new upload function
  deleteFile,
};
