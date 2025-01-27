// const Group = require('../Models/Group.model.js');
// const Group = require('../Models/Group.model.js');
const Group = require("../Models/Group.model.js");
const User = require("../Models/User.model.js");
const GroupController = {
  createGroup: async (req, res) => {
    try {
      const { owner, name, description, type, password, avatar } = req.body;

      // Enhanced input validation
      if (!owner || !type || !name) {
        return res.status(400).json({ 
          message: "Missing required fields",
          required: {
            owner: !owner,
            type: !type,
            name: !name
          }
        });
      }

      // Validate group type
      if (!["Private", "Public"].includes(type)) {
        return res.status(400).json({ message: "Invalid group type. Must be 'Private' or 'Public'" });
      }

      // Check if user exists
      const user = await User.findById(owner);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate password for private groups
      if (type === "Private" && !password) {
        return res.status(400).json({ message: "Password is required for private groups" });
      }

      // Create group with validated data
      const newGroup = new Group({
        owner,
        name,
        type,
        description: description || "",
        avatar: avatar || "",
        ...(type === "Private" && { password })
      });

      // Save the new group
      await newGroup.save();

      // Update user's created groups
      await User.findByIdAndUpdate(owner, {
        $addToSet: { CreatedGroup: newGroup._id },
      });

      res.status(201).json(newGroup);
    } catch (error) {
      console.error("Error in createGroup:", error);
      res.status(500).json({ 
        message: "Failed to create group",
        error: error.message 
      });
    }
  },

  joinGroup: async (req, res) => {
    try {
      const { userId, groupId, password } = req.body;
      
      // Enhanced input validation
      if (!userId || !groupId) {
        return res.status(400).json({ 
          message: "Missing required fields",
          required: {
            userId: !userId,
            groupId: !groupId
          }
        });
      }
  
      // Find user and group with error handling
      const [user, group] = await Promise.all([
        User.findById(userId),
        Group.findById(groupId)
      ]);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      // Check if user is already a member
      if (group.member.includes(userId)) {
        return res.status(400).json({ message: "User is already a member of this group" });
      }

      // Check if user is removed from the group
      if (group.removeMember?.includes(userId)) {
        return res.status(403).json({ message: "You are removed from this group" });
      }
  
      // Validate password for private groups
      if (group.type === "Private") {
        if (!password) {
          return res.status(400).json({ message: "Password is required for private groups" });
        }
        if (password !== group.password) {
          return res.status(403).json({ message: "Invalid password" });
        }
      }
  
      // Add user to group and update user's joined groups
      await Promise.all([
        Group.findByIdAndUpdate(groupId, { 
          $addToSet: { member: userId }
        }),
        User.findByIdAndUpdate(userId, { 
          $addToSet: { JoinedGroup: groupId }
        })
      ]);
  
      return res.status(200).json({ message: "Successfully joined the group" });
    } catch (error) {
      console.error("Error in joinGroup:", error);
      return res.status(500).json({ 
        message: "Failed to join group",
        error: error.message 
      });
    }
  },

  getGroup: async (req, res) => {
    try {
      const userID = req.params.id;

      if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Check if user exists
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch groups with populated data
      const GroupData = await Group.find({
        $or: [{ member: userID }, { owner: userID }]
      })
      .populate("member owner", "name email avatar GitHubProfileName LeetCodeProfileName time status")
      .lean();

      const calculateStudyTime = (userData) => {
        try {
          if (!userData?.time?.length) {
            return { studyTime: 0, status: "Offline" };
          }

          const lastTimeEntry = userData.time[userData.time.length - 1];
          if (!lastTimeEntry?.StartTime) {
            return { studyTime: 0, status: "Offline" };
          }

          const currentDate = new Date().setHours(0, 0, 0, 0);
          const startTimeAtMidnight = new Date(lastTimeEntry.StartTime).setHours(0, 0, 0, 0);

          if (currentDate > startTimeAtMidnight) {
            return { studyTime: 0, status: "Offline" };
          }

          if (lastTimeEntry.EndTime) {
            const endTime = new Date(lastTimeEntry.EndTime);
            const startTime = new Date(lastTimeEntry.StartTime);
            if (!isNaN(endTime) && !isNaN(startTime)) {
              return {
                studyTime: endTime - startTime,
                status: Date.now() < endTime.getTime() ? "Studying" : "Offline"
              };
            }
          }

          return { studyTime: 0, status: "Offline" };
        } catch (error) {
          console.error("Error calculating study time:", error);
          return { studyTime: 0, status: "Offline" };
        }
      };

      // Process group data
      GroupData.forEach(group => {
        if (group.member?.length) {
          group.member = group.member
            .filter(Boolean)
            .map(member => ({
              ...member,
              ...calculateStudyTime(member),
              time: undefined
            }));
        }

        if (group.owner) {
          group.owner = {
            ...group.owner,
            ...calculateStudyTime(group.owner),
            time: undefined
          };
        }
      });

      return res.status(200).json(GroupData);
    } catch (error) {
      console.error("Error in getGroup:", error);
      return res.status(500).json({ 
        message: "Failed to fetch group data",
        error: error.message 
      });
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
      const GroupData = await Group.findByIdAndDelete(GroupId);
      await User.findByIdAndUpdate(ownerId, {
        $pull: { CreatedGroup: GroupId }
      });
      GroupData.member.forEach(async (member) => {
        await User.findByIdAndUpdate(member, {
          $pull: { JoinedGroup: GroupId }
        });
      });
      
      res.status(200).json(GroupData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = GroupController;
