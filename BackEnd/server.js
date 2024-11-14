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
// User starts the timer
socket.on('startTimer', async ({ userId, groupIds, startTime, endTime }) => {
  const currentDay = new Date().setHours(0, 0, 0, 0);

  // Check if the user already has an entry for today
  const existingEntry = await User.findOne({
    _id: userId,
    time: { $elemMatch: { StartTime: { $gte: currentDay } } }
  });

  if (!existingEntry) {
    // First time today, add new entry with start and end times
    await User.findByIdAndUpdate(userId, { 
      $addToSet: { time: { StartTime: startTime, EndTime: endTime } } 
    });
  } else {
    // Update only the end time for today's entry
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { "time.$[elem].EndTime": endTime } },
      { 
        arrayFilters: [{ "elem.StartTime": { $gte: currentDay } }],
        sort: { "time": -1 },
        upsert: false
      }
    );
  }

  // Notify groups about the user starting the timer
  groupIds.forEach(group => {
    socket.to(group).emit('userStartedTimer', { userId, startTime });
  });

  console.log(`User ${userId} started the timer at ${startTime} for groups: ${groupIds}`);
});

// User pauses/stops the timer
socket.on('pauseTimer', async ({ userId, groupIds, endTime }) => {
  const currentDay = new Date().setHours(0, 0, 0, 0);

  // Update the user's latest entry's EndTime if it exists
  await User.findOneAndUpdate(
    { _id: userId },
    { $set: { "time.$[elem].EndTime": endTime } },
    { 
      arrayFilters: [{ "elem.StartTime": { $gte: currentDay } }],
      sort: { "time": -1 },
      upsert: false
    }
  );

  // Notify groups about the user pausing/stopping the timer
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
