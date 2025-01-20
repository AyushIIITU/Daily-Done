const mongoose = require("mongoose");

const youtubeSchema = new mongoose.Schema({
    
    videoId:{
        type:String,
        required: true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required: true,
    },
    thumbnail:{
        type:String,
        required: true,
    },
    duration:{
        type:String,
        // required: true,
    },
    progerss:{
        type:Number,
        default:0
    },
},{
    timestamps:true
});


const Youtube = new mongoose.model("Youtube", youtubeSchema);

module.exports = Youtube;
