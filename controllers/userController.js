const User = require("../models/user");
const Answer = require("../models/answer");
const Note = require("../models/note");
const Signal = require("../models/signal");
const Simulation = require("../models/simulation");
const Favourite = require("../models/favourite");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwtMiddleware");

const registerUser = async (req, res) => {
  try {
    let { password, ...userData } = req.body;

    let user = await User.findOne({
      email: userData.email,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur avec l'email donné existe déjà",
      });
    }
    if (userData.email === password) {
      return res.status(400).json({
        success: false,
        message: "Votre email ne peut pas être votre mot de passe",
      });
    }

    user = new User({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
    });

    user = await user.save();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur ne peut pas être créé",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${req.body.email}$`, "i") },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        if (!user.isValidated) {
          return res.status(400).json({
            success: false,
            message: "Votre compte n'est pas encore activé",
          });
        }
        const token = generateToken(user.id, user.isAdmin);
        res.status(200).json({
          success: true,
          data: user,
          message: "Connexion réussie",
          token: token,
        });
      } catch (tokenError) {
        res
          .status(500)
          .send("Une erreur s'est produite lors de la génération du jeton.");
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send("Une erreur s'est produite lors de la recherche de l'utilisateur.");
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant utilisateur manquant",
      });
    }

    let userData = {
      email: req.body.email,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      deviceToken: req.body.deviceToken,
      isValidated: req.body.isValidated,
      // yearId: req.body.year,
    };
    if (req.body.password) {
      userData.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .send(
        "Une erreur s'est produite lors de la mise à jour de l'utilisateur."
      );
    console.log(error);
  }
};
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }
    res.status(200).json({
      success: true,
      data: user,
      ...user._doc, //TODO: this will be removed in the future
    });
  } catch (error) {
    res.status(500).send("Une erreur s'est produite .");
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchText = req.query.text;

    let matchStage = { isAdmin: false };

    if (searchText) {
      matchStage.$or = [
        { email: { $regex: new RegExp(searchText, "i") } },
        { name: { $regex: new RegExp(searchText, "i") } },
        { phoneNumber: { $regex: new RegExp(searchText, "i") } },
      ];
    }

    // Aggregation Pipeline
    const usersAggregate = await User.aggregate([
      { $match: matchStage },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { passwordHash: 0 } }, // Exclude passwordHash
    ]);

    // Get total count of documents
    const totalCount = await User.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: usersAggregate,
      docs: usersAggregate, //TODO: this will be removed in the future
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-passwordHash"); // Exclude passwordHash for security

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Identifiant utilisateur manquant",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    await Promise.all([
      Answer.deleteMany({ user: userId }),
      Note.deleteMany({ user: userId }),
      Signal.deleteMany({ user: userId }),
      Simulation.deleteMany({ user: userId }),
      Favourite.deleteMany({ user: userId }),
    ]);

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message:
        "Utilisateur et toutes ses données associées ont été supprimés avec succès.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la suppression de l'utilisateur et de ses données associées.",
      error: error.message,
    });
  }
};

const resetAllDeviceTokens = async (req, res) => {
  try {
    const result = await User.updateMany({}, { deviceToken: "" });

    res.status(200).json({
      success: true,
      message: `Device tokens reset for ${result.modifiedCount} users.`,
    });
  } catch (error) {
    console.error("Error resetting device tokens:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation des deviceToken.",
    });
  }
};


const resetAllUsersValidation = async (req, res) => {
  try {
    const result = await User.updateMany(
      {},
      { $set: { isValidated: false } }
    );

    res.status(200).json({
      success: true,
      message: `Validation réinitialisée pour ${result.modifiedCount} utilisateurs.`,
    });
  } catch (error) {
    console.error("Error resetting users validation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation des validations utilisateurs.",
      error: error.message,
    });
  }
};



module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getMe,
  getUsers,
  deleteUser,
  getSingleUser,
  resetAllDeviceTokens,
  resetAllUsersValidation,
};
