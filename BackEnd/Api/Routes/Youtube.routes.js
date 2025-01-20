const express = require("express");
const Youtube = require("../Models/Youtube.model");
const { jwtAuthMiddleware } = require("../../Utils/jwt");
const User = require("../Models/User.model");
const YoutubeController = require("../Controller/Youtube.controller");
require('dotenv').config();
const router = express.Router();

router.get('/playlist/:playlistId',jwtAuthMiddleware,async(req,res)=>{
   try {
     const playlistId=req.params.playlistId;
     const {owner}=req.body;
     const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.API_KEY}`);
     
     const data = await response.json();
    const user=await User.find({name:owner})
    if(!user){
        return res.status(400).json({"Message":"User Does Not Exist"});
    }
     data.items.forEach(async item => {
        const newYoutube = new Youtube({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
        });
        await newYoutube.save();
    });
        return res.status(200).json(data.items);
   } catch (err) {
    console.error(err);
    return res.status(500).json({"Error":err.message});
   }
    
})
router.get('/video/:videoId',async(req,res)=>{
    try {
        const videoId=req.params.videoId;
        console.log(videoId)
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.API_KEY}`);
        const data = await response.json();
        const newYoutube = new Youtube({
            videoId: data.items[0].id,
            title: data.items[0].snippet.title,
            thumbnail: data.items[0].snippet.thumbnails.default.url,
            duration: data.items[0].contentDetails.duration,
        });
        await newYoutube.save();

        return res.status(200).json(newYoutube);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Error":err.message});
        
    }
})
router.get('/user/:userId',async(req,res)=>{
    try {
        const userId=req.params.userId;

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
