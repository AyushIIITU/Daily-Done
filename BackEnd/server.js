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
const Group = require('./Api/Models/Group.model');
const User = require('./Api/Models/User.model');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});
const userSocketIDs = new Map(); // to store user socket ids
const onlineUsers = new Set(); //  to store online users
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // // Handle user joining a group
  socket.on('joinGroup', async ({ userId, groupId }) => {
    socket.join(groupId);
    if (!onlineUsers.has(userId)) {
      onlineUsers.add(userId);
    }
    userSocketIDs.set(userId, socket.id);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // Handle user starting the study timer
  socket.on('startTimer', async ({ userId, groupIds, startTime,endTime }) => {
    // Save the start time in the user's record
    await User.findByIdAndUpdate(userId, { $addToSet: { time: { StartTime: startTime, EndTime: endTime } } });
    
    // Broadcast to all groups that the user has started studying
    groupIds.forEach(group => {
      console.log(group);
      socket.to(group).emit('userStartedTimer', { userId, startTime });
    });

    console.log(`User ${userId} started the timer at ${startTime} for groups: ${groupIds}`);
  });

  // Handle user stopping/pausing the study timer
  socket.on('pauseTimer', async ({ userId, groupIds, endTime }) => {
    // Update the user's latest time entry to add an EndTime
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { "time.$[elem].EndTime": endTime } },
      { 
        arrayFilters: [{ "elem": { $exists: true } }],
        sort: { "time": -1 },
        upsert: false
      }
    );
  
    // Notify groups that the user has paused/stopped their timer
    groupIds.forEach(groupId => {
      socket.to(groupId).emit('userPausedTimer', { userId, endTime });
    });
  
    console.log(`User ${userId} paused the timer at ${endTime}`);
  });
  

  // Handle user disconnection
  socket.on('disconnect', async () => {
    const userId = Array.from(userSocketIDs.entries()).find(([_, id]) => id === socket.id)?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      userSocketIDs.delete(userId);

      // Find any ongoing study session for the user and set its EndTime to the current time
      const endTime = new Date();
      await User.findOneAndUpdate(
        { _id: userId, "time.EndTime": null },
        { $set: { "time.$.EndTime": endTime } }
      );

      // Notify all groups the user belongs to that they have stopped the timer
      const user = await User.findById(userId).populate("JoinedGroup");
      if (user) {
        user.JoinedGroup.forEach(group => {
          socket.to(group._id.toString()).emit('userStoppedTimer', { userId, endTime });
        });
      }

      console.log(`User ${userId} disconnected and stopped the timer`);
    }
  });
});


const PORT = process.env.PORT || 3000;
app.use('/api/user', userRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/yt', youtubeRoutes);
app.use('/api/group', groupRoutes);
app.get("/", (req, res) => {
  res.send("Server is ok");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
