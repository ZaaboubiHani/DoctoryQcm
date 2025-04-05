const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const fs = require("fs");
const express = require("express");
// Express app with increased file size limit
const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

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


// Multer instance for document uploads with increased file size limit (100MB)
const uploadDoc = multer({
  storage: createStorage("documents"),
  fileFilter: documentFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set limit to 100MB
}).single("document");

// Upload document handler
const uploadDocument = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadDoc(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return reject({ status: 413, message: "File size exceeds limit (100MB)." });
          }
          return reject(err);
        }
        resolve();
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
    res.status(err.status || 500).send({
      message: err.message || "Error occurred during document upload.",
      error: err,
    });
  }
};
// File filter for documents (PDF, Word)
const apkFilter = (req, file, cb) => {
  const filetypes = /apk/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/vnd.android.package-archive'; // Match the specific MIME type

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only APK files are allowed!");
  }
};

const uploadApk = multer({
  storage: createStorage("versions"),
  fileFilter: apkFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set limit to 100MB
}).single("apk");


// Upload document handler
const uploadAPK = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadApk(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return reject({ status: 413, message: "File size exceeds limit (100MB)." });
          }
          return reject(err);
        }
        resolve();
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
    console.log("Error during file upload:", err);
    
    res.status(err.status || 500).send({
      message: err.message || "Error occurred during document upload.",
      error: err,
    });
  }
};


// Delete file function
const deletePath = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Delete file handler
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: "File not found in DB" });
    }

    if (!file.url) {
      return res.status(400).send({ message: "File URL is missing in DB" });
    }

    const baseUrl = process.env.BASE_URL;

    const filePath = path.join(__dirname, "..", file.url.replace(baseUrl, ""));

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist on disk:", filePath);
      return res.status(404).send({ message: "File not found on server" });
    }

    await deletePath(filePath);
    await File.findByIdAndDelete(fileId);

    res.send({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error during file deletion:", err);
    res.status(500).send({
      message: "Error occurred during deletion",
      error: err.message,
    });
  }
};


module.exports = {
  uploadDocument,
  uploadAPK,
  deleteFile,
};
