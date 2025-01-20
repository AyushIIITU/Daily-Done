const youtube = require("../Models/Youtube.model.js");
const User = require("../Models/User.model.js");
const YoutubeController = {
  getYoutubeVideo: async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "You are not authorized to access this resource." });
      }
      const youtube = await youtube.find({ owner: req.user._id });
      res.status(200).json(youtube);
    } catch (error) {
      console.log("Error in getYoutube", error);
    }
  },
  updateProgress: async (req, res) => {
    try {
      const youtubeId = req.params.id;
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "You are not authorized to access this resource." });
      }
      const youtube = await youtube.findByIdAndUpdate(
        youtubeId,
        { progress: req.body.progress },
        { new: true }
      );
      res.status(200).json(youtube);
    } catch (err) {
      return res.status(500).json("Error", err);
    }
  },

  deleteYoutubeVideo: async (req, res) => {
    try {
      const youtubeId = req.params.id;
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "You are not authorized to access this resource." });
      }
      await youtube.findByIdAndDelete(youtubeId);
      res.status(200).json({ message: "Youtube video Deleted" });
    } catch (error) {
      console.log("Error in deleteYoutube", error);
    }
  },
};
module.exports = YoutubeController;
