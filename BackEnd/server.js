const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const app = express();
const userRoutes = require('./Api/Routes/User.routes');
const diaryRoutes = require('./Api/Routes/Diary.routes');
const youtubeRoutes = require('./Api/Routes/Youtube.routes');
const groupRoutes = require('./Api/Routes/Group.routes');
const aiRoutes = require('./Api/Routes/Ai.routes');
const Group = require('./Api/Models/Group.model');
const User = require('./Api/Models/User.model');

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

// Maps and sets to track users and socket connections
const userSocketIDs = new Map();
const onlineUsers = new Set();
// Unjoined users are those who have not joined any group due to server restart




io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('customConnect', async ({ userId }) => {
    try {
      if (!userId) throw new Error('User ID is required');

      // Track the user and their socket
      userSocketIDs.set(userId, socket.id);
      onlineUsers.add(userId);

      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  // Convert Map to Object
  const onlineUsersObject = Object.fromEntries(userSocketIDs);

  // Broadcast online users list as an object
  io.emit('onlineUsers', onlineUsersObject);
    } catch (err) {
      console.error(`Error in customConnect: ${err.message}`);
    }
  });
  // User joins a group
  socket.on('joinGroup', async ({ userId, groupId }) => {
    try {
      socket.join(groupId);
      
      console.log(`User ${userId} joined group ${groupId}`);


    } catch (error) {
      console.error(`Error in joinGroup: ${error.message}`);
    }
  });
  socket.on('leaveGroup', async ({ userId, groupId }) => {
    try {
      socket.leave(groupId);
      
    } catch (error) {
      console.error(`Error in leaveGroup: ${error.message}`);
    }
  });
  // User starts the timer
  socket.on('startTimer', async ({ userId, groupIds, startTime, endTime }) => {
    try {
      console.log(`Received startTimer event for user ${userId}`);
      const currentDay = new Date(new Date().setHours(0, 0, 0, 0));
  
      // Check or update user timer
      const user = await User.findOne({ _id: userId, "time.StartTime": { $gte: currentDay } });
      if (!user) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { time: { StartTime: startTime, EndTime: endTime } }
        });
      } else {
        await User.updateOne(
          { _id: userId, "time.StartTime": { $gte: currentDay } },
          { $set: { "time.$.EndTime": endTime } }
        );
      }
  
      // Emit updates to groups
      groupIds.forEach(groupId => {
        socket.to(groupId).emit('userStartedTimer', { userId, startTime, endTime });
      });
  
      console.log(`User ${userId} started timer from ${startTime} to ${endTime}`);
    } catch (error) {
      console.error(`Error in startTimer: ${error.message}`);
    }
  });
  
  
  socket.on('getGroupDetails', async ({ group }) => {
    try {
      // const onlineUsers;
      console.log(group);
    } catch (err) {
      console.error(`Error in getGroupDetails: ${err.message}`);
    }
  });

  // User pauses or stops the timer
  socket.on('pauseTimer', async ({ userId, groupIds, endTime }) => {
    try {
      const currentDay = new Date().setHours(0, 0, 0, 0);

      const response=await User.findOneAndUpdate(
        { _id: userId },
        { $set: { "time.$[elem].EndTime": endTime } },
        {
          arrayFilters: [{ "elem.StartTime": { $gte: currentDay } }],
          upsert: false
        }
      );
      const StudyTime=response.time[response.time.length-1].EndTime-response.time[response.time.length-1].StartTime;
      // Notify all relevant groups
      groupIds.forEach(groupId => {
        socket.to(groupId).emit('userPausedTimer', { userId, time:StudyTime });
      });

      console.log(`User ${userId} paused the timer`);
    } catch (error) {
      console.error(`Error in pauseTimer: ${error.message}`);
    }
  });

  socket.on('disconnect', async () => {
    try {

       
      const userId = [...userSocketIDs.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        onlineUsers.delete(userId);
        userSocketIDs.delete(userId);
         // Notify others about the disconnection
         io.emit('onlineUsers', Array.from(onlineUsers));
        const endTime = new Date();
        const currentDay = new Date(new Date().setHours(0, 0, 0, 0));
  
        // Ensure the `time` array exists before updating
        const user = await User.findById(userId);
        if (!user) {
          console.error(`User not found: ${userId}`);
          return;
        }
  
        // If the `time` array doesn't exist, initialize it
        if (!user.time || !Array.isArray(user.time)) {
          user.time = [];
        }
  
        // Check for today's entry and update or create it
        const todayEntryIndex = user.time.findIndex((entry) => entry.StartTime >= currentDay);
        if (todayEntryIndex === -1) {
          // No entry for today; add a new one
          user.time.push({ StartTime: endTime, EndTime: endTime });
        } else {
          // Update the EndTime for today's entry
          user.time[todayEntryIndex].EndTime = endTime;
        }
  
        await user.save();
  
        const studyTime = user.time[todayEntryIndex]?.EndTime - user.time[todayEntryIndex]?.StartTime;
  
        // Notify groups the user belongs to
        const populatedUser = await User.findById(userId).populate("JoinedGroup CreatedGroup");
        if (populatedUser) {
          populatedUser.JoinedGroup.forEach(group => {
            socket.to(group._id.toString()).emit('userPausedTimer', { userId, time: studyTime });
          });
          populatedUser.CreatedGroup.forEach(group => {
            socket.to(group._id.toString()).emit('userPausedTimer', { userId, time: studyTime });
          });
        }
  
        console.log(`User ${userId} disconnected and stopped the timer`);
      }
    } catch (error) {
      console.error(`Error in disconnect handler: ${error.message}`);
    }
  });
  
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/yt', youtubeRoutes);
app.use('/api/group', groupRoutes);
app.use('/ai', aiRoutes);
app.get("/", (req, res) => {
  res.send("Server is ok Kya");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
