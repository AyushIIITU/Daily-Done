const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["Productive","Non-Productive"],
        required:true
    
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});


const Diary = new mongoose.model("Diary", diarySchema);

module.exports = Diary;
