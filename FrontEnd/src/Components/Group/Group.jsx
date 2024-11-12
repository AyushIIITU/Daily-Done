import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API } from '../../Utils/API';

const socket = io(API); // Adjust to your server URL if needed

const Group = ({ groupId, userId }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Join group room
    socket.emit('joinGroup', groupId);
    console.log(`Joined group: ${groupId}`);

    // Listen for timer started event
    socket.on('timerStarted', (data) => {
      console.log("Timer started event received");
      setIsRunning(true);
      const elapsedTime = Math.floor((Date.now() - data.startTime) / 1000);
      setTimer(elapsedTime);
      enterFullScreen();
    });

    // Listen for timer paused event
    socket.on('timerPaused', () => {
      console.log("Timer paused event received");
      setIsRunning(false);
      setIsFullScreen(false);
      exitFullScreen();
    });

    return () => {
      socket.off('timerStarted');
      socket.off('timerPaused');
      socket.disconnect();
    };
  }, [groupId]);

  // Timer updates every second when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      console.log("Starting interval for timer");
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      console.log("Clearing interval for timer");
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      console.log("Starting timer");
      socket.emit('startTimer', { groupId, userId, startTime: Date.now() });
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    console.log("Pausing timer");
    socket.emit('pauseTimer', groupId);
    setIsRunning(false)
  };

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.log("Error entering full screen:", err));
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) => console.log("Error exiting full screen:", err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-3xl">
      <h1>Group Timer</h1>
      <div className="my-4 text-5xl font-bold">{Math.floor(timer)} s</div>
      <button onClick={isRunning ? handlePause : handleStart} className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default Group;
