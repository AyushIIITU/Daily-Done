const diary = require('../Models/Diary.model.js');
const User = require('../Models/User.model.js');
const DiaryController={
    addDiary: async (req, res) => {
        try {
            const { task } = req.body;
    
            // Check if the user is authenticated
            if (!req.user) {
                return res.status(401).json({ message: "You are not authorized to access this resource." });
            }
    
            // Validate the task input
            if (!task) {
                return res.status(400).json({ message: "Task is required." });
            }
    
            // Make the prediction request
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "text":task }),
            });
    
            // Check if the response is ok
            if (!response.ok) {
                console.log(response,task);
                return res.status(500).json({ message: "Prediction service error." });
            }
    
            const data = await response.json();
    
            // Check the response from the prediction service
            if (!data || typeof data.prediction !== 'number') {
                console.log(data);
                return res.status(500).json({ message: "Prediction service error." });
            }
    
            // Determine if the task is productive or non-productive
            console.log(data.prediction,data.prediction === 0 );
            const productivityStatus = data.prediction === 0 ? "Non-Productive" : "Productive";
    
            // Create a new diary entry
            const newDiary = new diary({
                task,
                type: productivityStatus,
                owner: req.user._id
            });
    
            // Save the new diary entry
            await newDiary.save();
    
            // Respond with the created diary entry
            res.status(201).json(newDiary);
        } catch (error) {
            console.error("Error in addDiary:", error);
            res.status(500).json({ message: "An error occurred while adding the diary entry." });
        }
    },
    
    
    getDiary:async(req,res)=>{
        try {
            if(!req.user){
                return res.status(401).json({message:"You are not authorized to access this resource."})
            }
            const diaries = await diary.find({owner:req.user._id});
            res.status(200).json(diaries);
        } catch (error) {
            console.log("Error in getDiary",error);
        }
    },
    updateDiary:async(req,res)=>{
        try {
            const {task,type} = req.body;
            const diaryId = req.params.id;
            if(!req.user){
                return res.status(401).json({message:"You are not authorized to access this resource."})
            }
            const updatedDiary = await diary.findByIdAndUpdate(diaryId,{task,type},{new:true});
            res.status(200).json(updatedDiary);
        } catch (error) {
            console.log("Error in updateDiary",error);
        }
    },
    alterType:async (req,res) => {
      try {
        const diaryId = req.params.id;
        console.log(req.user);  
        
        // const { type } = req.body;
        if(!req.user){
            return res.status(401).json({message:"You are not authorized to access this resource."})
        }
        const {type}=await diary.findById(diaryId);
        const typee=type==="Productive"?"Non-Productive":"Productive";
        const diaryData = await diary.findByIdAndUpdate(diaryId,{type:typee});
        res.status(200).json(diaryData);

      } catch (err) {
        console.error(err);
        
      }  
    },
    deleteDiary:async(req,res)=>{
        try {
            const diaryId = req.params.id;
            if(!req.user){
                return res.status(401).json({message:"You are not authorized to access this resource."})
            }
            await diary.findByIdAndDelete(diaryId);
            res.status(200).json({message:"Diary Deleted"});
        } catch (error) {
            console.log("Error in deleteDiary",error);
        }
    }

}
module.exports=DiaryController
