const fs = require("fs");
const path = require("path");
const File = require("../models/file"); // Adjust the path to your File model
const Version = require("../models/version");

const createVersion = async (req, res) => {
  try {
    const newVersion = new Version({
      ...req.body,
    });

    let createdVersion = await newVersion.save();

    // ✅ Populate file only if it exists
    if (req.body.file) {
      createdVersion = await createdVersion.populate("file");
    }

    res.status(201).json({ success: true, data: createdVersion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Version" });
  }
};

const updateVersion = async (req, res) => {
  const versionId = req.params.id;

  try {
    
    const updatedVersion = await Version.findByIdAndUpdate(versionId, req.body, {
      new: true,
    }).populate("file"); // ✅ Populate the file field if it exists

    if (!updatedVersion) {
      return res.status(404).json({ error: "Version not found" });
    }

    res.status(200).json({ success: true, data: updatedVersion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Version" });
  }
};

const deletePath = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT")
        reject(err); // Ignore "file not found" errors
      else resolve();
    });
  });
};

const deleteVersion = async (req, res) => {
  const versionId = req.params.id;

  try {
    // ✅ Find the version first
    const version = await Version.findById(versionId);
    if (!version) {
      return res.status(404).json({ error: "Version not found" });
    }

    // ✅ Delete the associated file if it exists
    if (version.file) {
      const file = await File.findById(version.file);
      if (file) {
        const baseUrl = process.env.BASE_URL;
        const filePath = file.url.replace(baseUrl, ""); // Get the file path
        await deletePath(path.join(__dirname, "../", filePath)); // Delete from directory
        await File.findByIdAndDelete(file._id); // Delete from DB
      }
    }

    // ✅ Now delete the version
    await Version.findByIdAndDelete(versionId);

    res
      .status(200)
      .json({ success: true, message: "Version deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting Version" });
  }
};



const getVersions = async (req, res) => {
  try {
    
    const versions = await Version.find()
      .populate("file") 
      .exec();

    res.status(200).json({ success: true, data: versions });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Version" });
  }
};

const getLastVersion = async (req, res) => {
  try {
    const latestVersion = await Version.findOne()
      .sort({ createdAt: -1 }) // newest first
      .populate("file")
      .exec();

    res.status(200).json({ success: true, data: latestVersion });
  } catch (error) {
    res.status(500).json({ error: "Error fetching latest Version" });
  }
};


module.exports = {
  createVersion,
  updateVersion,
  deleteVersion,
  getVersions,
  getLastVersion,
};
