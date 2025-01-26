const Youtube = require("../Models/Youtube.model.js");
const User = require("../Models/User.model.js");
const YoutubeController = {
  getYoutubeVideo: async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "You are not authorized to access this resource." });
      }
      const userEmail=req.user.email;
      const user=await User.findOne({email:userEmail});
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      const userId=user._id;
      const videos = await Youtube.find({ owner: userId });
      // const videos = await Youtube.find({ owner: req.user });
      res.status(200).json(videos);
    } catch (error) {
      console.log("Error in getYoutube", error);
      res.status(500).json({ error: error.message });
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
      const userEmail = req.user.email;
      const user = await User.findOne({email: userEmail});
      
      if(!user) {
        return res.status(404).json({message: "User not found"});
      }
      
      const userId = user._id;
    

      // Update the video progress
      console.log(youtubeId,req.body.progress);
      const video = await Youtube.findOneAndUpdate(
        { videoId: youtubeId, owner: userId },
        { $set: { progress: req.body.progress } },
        { new: true }
      );
      console.log(video);
      res.status(200).json(video);
    } catch (err) {
      console.error("Error updating progress:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  deleteYoutubeVideo: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the video and ensure it belongs to the current user
      const video = await Youtube.findOne({ _id: id, owner: req.user._id });
      
      if (!video) {
        return res.status(404).json({ message: "Video not found or unauthorized" });
      }

      await Youtube.findByIdAndDelete(id);
      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error in deleteYoutube", error);
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = YoutubeController;
