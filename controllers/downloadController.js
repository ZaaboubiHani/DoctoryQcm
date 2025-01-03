const path = require("path");

const downloadApk = (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "files", "dctory_qcm_1.3.0.apk");
    res.download(filePath, "dctory_qcm_1.3.0.apk", (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Une erreur s'est produite lors du téléchargement d'APK.",
          });
        }
        console.log(err);
      }
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Une erreur s'est produite lors de la tentative de téléchargement d'APK.",
      });
    }
    console.log(error);
  }
};

module.exports = {
  downloadApk,
};
