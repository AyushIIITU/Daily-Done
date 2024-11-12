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

io.on('connection', (socket) => {
  socket.on('joinGroup', async (groupId) => {
    try {
      const group = await Group.findById(groupId);
      if (group) {
        io.emit("Online");
      }
    } catch (error) {
      console.error("Error in joinGroup:", error);
    }
  });

  socket.on('startTimer', async ({ userId }) => {
    try {
      // Append StartTime to the latest HeatMap entry
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { "HeatMap.$[].time": { StartTime: Date.now() } } }, // Ensures the latest HeatMap entry is updated
        { new: true }
      );
      if (user) {
        const groups = [...user.JoinedGroup, ...user.CreatedGroup];
        groups.forEach((groupId) => {
          io.to(groupId.toString()).emit('timerStarted');
        });
      }
    } catch (error) {
      console.error("Error in startTimer:", error);
    }
  });
  
  socket.on('pauseTimer', async ({ userId }) => {
    try {
      // Append EndTime to the latest HeatMap entry
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { "HeatMap.$[].time": { EndTime: Date.now() } } },
        { new: true }
      );
      if (user) {
        const groups = [...user.JoinedGroup, ...user.CreatedGroup];
        groups.forEach((groupId) => {
          io.to(groupId.toString()).emit('timerEnds');
        });
      }
    } catch (error) {
      console.error("Error in pauseTimer:", error);
    }
  });
  
  socket.on('disconnect', async (userId) => {
    try {
      // Set EndTime in the latest entry on disconnect
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { "HeatMap.$[].time": { EndTime: Date.now() } } },
        { new: true }
      );
      if (user) {
        const groups = [...user.JoinedGroup, ...user.CreatedGroup];
        groups.forEach((groupId) => {
          io.to(groupId.toString()).emit('timerEnds');
        });
      }
    } catch (error) {
      console.error("Error in disconnect:", error);
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
