// const Group = require('../Models/Group.model.js');
// const Group = require('../Models/Group.model.js');
const Group = require("../Models/Group.model.js");
const User = require("../Models/User.model.js");
const GroupController = {
  createGroup: async (req, res) => {
    try {
      const { owner,name, description,type, password, avatar } = req.body;

      // Validate the task input
      if (!owner || !type||!name) {
        console.log(owner,type,name);
        return res.status(400).json({ message: "Owner or Type pr Name is required." });
      }
      const user = User.findById(owner);
      if (!user) {
        return res.status(406).json({ message: "User is not Exists" });
      }
      let newGroup;

      if (type === "Private") {
        newGroup = new Group({
          owner: owner,
          name,
          type: "Private",
          password: password,
          avatar: avatar,
          description,
        });
      } else {
        newGroup = new Group({
          owner: owner,
          type: "Public",
          avatar: avatar,
          name,
            description,
          // password:password
        });
      }

      // Save the new Group entry
      await newGroup.save();
      await User.findByIdAndUpdate(owner, {
        $push: { CreatedGroup: newGroup._id },
      });
      // Respond with the created Group entry
      res.status(201).json(newGroup);
    } catch (error) {
      console.error("Error in addGroup:", error);
      res
        .status(500)
        .json({ message: "An error occurred while adding the Group entry." });
    }
  },

  joinGroup: async (req, res) => {
    try {
      const { userId, groupId, password } = req.body;
      
      // Check if userId and groupId are provided
      if (!userId || !groupId) {
        return res
          .status(400)
          .json({ message: `userId and groupId are required` });
      }
  
      // Find user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find group by groupId
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      // Check if the user is already removed from the group
      if (group.removeMember && group.removeMember.includes(userId)) {
        return res.status(403).json({ message: "You are removed from this group" });
      }
  
      // Validate password if the group is private
      if (group.type === "Private" && password !== group.password) {
        return res.status(403).json({ message: "Invalid password" });
      }
  
      // Add userId to group members
      await Group.findByIdAndUpdate(groupId, { $addToSet: { member: userId } });

      // Add groupId to user's joined groups
      await User.findByIdAndUpdate(userId, { $addToSet: { JoinedGroup: groupId } });
  
      return res.status(200).json({ message: "You have been added to the group" });
    } catch (error) {
      console.error("Error in joinGroup", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
,  
getGroup: async (req, res) => {
  try {
    const userID = req.params.id;

    // Check if userID is provided
    if (!userID) {
      return res.status(400).json({ message: "userID is required" });
    }

    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(406).json({ message: "User Not Found" });
    }

    // Fetch group data for the user
    const GroupData = await Group.find({ $or: [{ member: userID }, { owner: userID }] })
      .populate("member owner", "name email avatar GitHubProfileName LeetCodeProfileName time") // Exclude "time" here
      .lean(); // Convert Mongoose documents to plain JavaScript objects for modification
    // console.log(GroupData.);
    // Function to calculate study time for a user (member/owner)
    const calculateStudyTime = (userTime) => {
      if (userTime && userTime.length > 0) {
        const lastTimeEntry = userTime[userTime.length - 1];
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const startTimeAtMidnight = new Date(lastTimeEntry.StartTime).setHours(0, 0, 0, 0);

        // If the start time is before today, reset study time to 0
        if (currentDate > startTimeAtMidnight) {
          return 0;
        }

        // Calculate study time if valid
        if (lastTimeEntry.EndTime && lastTimeEntry.StartTime) {
          const endTime = new Date();
          const startTime = new Date(lastTimeEntry.StartTime);
          if (!isNaN(endTime) && !isNaN(startTime)) {
             return endTime - startTime;
          }
        }
      }
      return 0; // Default to 0 if no valid time data exists
    };

    // Loop through each group and calculate study time for members and owners
    GroupData.forEach((group) => {
      // Calculate and add study time for members
      group.member.forEach((memb) => {
        memb.studyTime = calculateStudyTime(memb.time);
        if(memb.studyTime>0){
          if(Date.now()<memb.time[memb.time.length-1].EndTime){
            memb.status="Studying";
          }
        }
        
         // Calculate study time
        delete memb.time; // Remove the "time" field from the response
      });

      // Calculate and add study time for owner
      group.owner.studyTime = calculateStudyTime(group.owner.time);
      if(group.owner.studyTime>0){
        if(Date.now()<group.owner.time[group.owner.time.length-1].EndTime){
          group.owner.status="Studying";
        }
      }
       // Calculate study time
      //  console.log(group.owner.studyTime,group.owner.time)
      delete group.owner.time; // Remove the "time" field from the response
    });

    // Return the group data with updated study time
    return res.status(200).json(GroupData);

  } catch (err) {
    console.log("Error in GET Group", err);
    return res.status(500).json({ message: "An error occurred while fetching group data" });
  }
}

,
  getPublicGroup: async (req, res) => {
    try {
      const GroupData = await Group.find({ type: "Public" })
      .select("-password");
      res.status(200).json(GroupData);
    } catch (err) {
      console.log("Error in GET Group", err);
      return res.status(500).json({ message: "Error got" });
    }},
  removeMember: async (req, res) => {
    try {
      const { userId, ownerId } = req.body;
      const GroupId = req.params.id;
      if (!GroupId || !userId || !ownerId) {
        return res
          .status(400)
          .json({ message: "userID and groupId is required" });
      }
      const Group = await Group.findById(GroupId);
      if (!GroupId) {
        return res.status(406).json({ message: "Group is Not Found" });
      }
      if (Group.owner !== ownerId) {
        return res.status(405).json({ message: "Unautorised access" });
      }
      if (!Group.member.includes(userId)) {
        return res.status(406).json({ message: "User is Not Found" });
      }
      const updatedGroup = await Group.findByIdAndUpdate(GroupId, {
        $push: { removeMember: userId },
        $pop: { member: userId },
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.log("Error in updateGroup", error);
    }
  },
  deleteGroup: async (req, res) => {
    try {
      const GroupId = req.params.id;

      const { ownerId } = await Group.findById(GroupId);
      if (!ownerId) {
        return res.status(406).json({ message: "Group is Not Found" });
      }
      const Group = await Group.findById(GroupId);
      if (ownerId !== req.user.id && req.owner !== ownerId) {
        return res.status(405).json({ message: "Unautorised access" });
      }
      await Group.findByIdAndDelete(GroupId);
      res.status(200).json(GroupData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = GroupController;
