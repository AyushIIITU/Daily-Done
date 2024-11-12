const express = require("express");
require('dotenv').config();
const router = express.Router();

router.get('/playlist/:id',async(req,res)=>{
   try {
     const id=req.params.id;
     const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${id}&key=${process.env.API_KEY}`);
     const data = await response.json();
        return res.status(200).json(data);
   } catch (err) {
    console.log(err);
    return res.status(500).json({"Error":err.message});
   }
    
})
router.get('/video/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        console.log(id)
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${process.env.API_KEY}`);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Error":err.message});
        
    }
})



module.exports = router;
