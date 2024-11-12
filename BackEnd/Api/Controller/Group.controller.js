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
      if (!userID) {
        return res.status(400).json({ message: "userID is required" });
      }
      const user = await User.findById(userID);
      if (!user) {
        return res.status(406).json({ message: "User is Not Found" });
      }
      const GroupData = await Group.find({ $or: [{ member: userID }, { owner: userID }] }).populate("member owner", "name email avatar GitHubProfileName LeetCodeProfileName time");
      res.status(200).json(GroupData);
    } catch (err) {
      console.log("Error in GET Group", err);
      return res.status(500).json({ message: "Error got" });
    }
  },
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
  // deleteGroup:async(req,res)=>{
  //     try {
  //         const GroupId = req.params.id;
  //         if(!req.user){
  //             return res.status(401).json({message:"You are not authorized to access this resource."})
  //         }
  //         await Group.findByIdAndDelete(GroupId);
  //         res.status(200).json({message:"Group Deleted"});
  //     } catch (error) {
  //         console.log("Error in deleteGroup",error);
  //     }
  // }
};
module.exports = GroupController;
