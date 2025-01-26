const express = require("express");
const Youtube = require("../Models/Youtube.model");
const { jwtAuthMiddleware } = require("../../Utils/jwt");
const User = require("../Models/User.model");
const YoutubeController = require("../Controller/Youtube.controller");
require('dotenv').config();
const router = express.Router();

router.get('/playlist/:playlistId', jwtAuthMiddleware, async(req, res) => {
   try {
     const playlistId = req.params.playlistId;
     const user = await User.findOne({email:req.user.email});
     if(!user){
         return res.status(404).json({message:"User not found"});
     }
     const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.API_KEY}`);
     
     const data = await response.json();
     
     // Save videos with owner reference
     const savedVideos = await Promise.all(data.items.map(async item => {
        const newYoutube = new Youtube({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            owner: user._id  // Add the user ID as owner
        });
        return await newYoutube.save();
    }));

    return res.status(200).json(savedVideos);
   } catch (err) {
    console.error(err);
    return res.status(500).json({"Error": err.message});
   }
})

router.get('/video/:videoId', jwtAuthMiddleware, async(req, res) => {
    try {
        const videoId = req.params.videoId;
        const user = await User.findOne({email:req.user.email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.API_KEY}`);
        const data = await response.json();
        
        const newYoutube = new Youtube({
            videoId: data.items[0].id,
            title: data.items[0].snippet.title,
            thumbnail: data.items[0].snippet.thumbnails.default.url,
            duration: data.items[0].contentDetails.duration,
            owner: user._id  // Add the user ID as owner
        });
        await newYoutube.save();

        return res.status(200).json(newYoutube);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Error": err.message});
    }
})

router.get('/user/:userId',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userEmail=req.user.email;
        const user = await User.findOne({email:userEmail});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        // const userId=user._id;
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${userId}&key=${process.env.API_KEY}`);
        const data = await response.json();
        return res.status(200).json(data.items[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Error":err.message});
    }
})

router.get('/user',jwtAuthMiddleware,YoutubeController.getYoutubeVideo);
router.patch('/video/:id',jwtAuthMiddleware,YoutubeController.updateProgress)
router.delete('/video/:id',jwtAuthMiddleware,YoutubeController.deleteYoutubeVideo)




module.exports = router;
