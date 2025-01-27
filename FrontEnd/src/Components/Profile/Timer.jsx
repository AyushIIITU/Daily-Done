import React, { useState, useEffect, useRef } from "react";
import { Timer as TimerIcon, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";

const user = JSON.parse(localStorage.getItem("user"));

const Timers = ({ socket, group }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [editingField, setEditingField] = useState(null);
  const [startTimeStamp, setStartTimeStamp] = useState(null);
  const timerRef = useRef(null);
  const disconnectTimeoutRef = useRef(null);

  // Handle scroll input
  const handleScroll = (e, unit) => {
    e.preventDefault();
    if (isRunning) return;

    const delta = e.deltaY > 0 ? -1 : 1;
    const maxValue = unit === 'hours' ? 23 : 59;

    setTime(prev => {
      const newValue = Math.max(0, Math.min(maxValue, prev[unit] + delta));
      const newTime = { ...prev, [unit]: newValue };
      
      // Update total seconds
      setTotalSeconds((newTime.hours * 3600) + (newTime.minutes * 60));
      return newTime;
    });
  };

  // Handle direct input
  const handleDirectInput = (unit, value) => {
    if (isRunning) return;

    const numValue = parseInt(value) || 0;
    const maxValue = unit === 'hours' ? 23 : 59;
    const newValue = Math.max(0, Math.min(maxValue, numValue));

    setTime(prev => {
      const newTime = { ...prev, [unit]: newValue };
      // Update total seconds
      setTotalSeconds((newTime.hours * 3600) + (newTime.minutes * 60));
      return newTime;
    });
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0 });
    setTotalSeconds(0);
    setStartTimeStamp(null);
    exitFullscreen();
  };

  // Handle timer countdown
  useEffect(() => {
    let interval;
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          // Update time display
          const hours = Math.floor(prev / 3600);
          const minutes = Math.floor((prev % 3600) / 60);
          setTime({ hours, minutes });
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  // Handle socket reconnection
  useEffect(() => {
    if (!socket) return;

    const handleReconnect = async () => {
      if (startTimeStamp && isRunning) {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - new Date(startTimeStamp)) / 1000);
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

        if (remainingSeconds > 0) {
          setTotalSeconds(remainingSeconds);
        } else {
          handleTimerComplete();
        }
      }
      clearTimeout(disconnectTimeoutRef.current);
    };

    const handleDisconnect = () => {
      // Set a timeout to handle prolonged disconnections
      disconnectTimeoutRef.current = setTimeout(() => {
        if (isRunning) {
          handleTimerComplete();
          toast.error("Connection lost. Timer stopped.");
        }
      }, 5000); // Wait 5 seconds before stopping timer
    };

    socket.on('connect', handleReconnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleReconnect);
      socket.off('disconnect', handleDisconnect);
      clearTimeout(disconnectTimeoutRef.current);
    };
  }, [socket, isRunning, totalSeconds, startTimeStamp]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    exitFullscreen();
    updateStudyTime();
  };

  const updateStudyTime = () => {
    if (!startTimeStamp) return;

    const endTime = new Date();
    socket.emit("pauseTimer", {
      userId: user.id,
      groupIds: group,
      endTime,
    });

    // Store study time locally in case of connection issues
    const studySession = {
      startTime: startTimeStamp,
      endTime: endTime.toISOString(),
      duration: Math.floor((endTime - new Date(startTimeStamp)) / 1000)
    };
    
    const storedSessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    storedSessions.push(studySession);
    localStorage.setItem('studySessions', JSON.stringify(storedSessions));

    setStartTimeStamp(null);
  };

  // Fullscreen handlers
  const enterFullscreen = async () => {
    try {
      if (timerRef.current.requestFullscreen) {
        await timerRef.current.requestFullscreen();
      } else if (timerRef.current.webkitRequestFullscreen) {
        await timerRef.current.webkitRequestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
      toast.error("Couldn't enter fullscreen mode");
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    } catch (err) {
      console.error("Exit fullscreen error:", err);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && isRunning) {
      handleTimerComplete();
      toast.info("Timer stopped due to fullscreen exit");
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isRunning]);

  const toggleTimer = async () => {
    if (totalSeconds === 0) {
      toast.error("Please set a time before starting");
      return;
    }

    if (!isRunning) {
      const startTime = new Date();
      setStartTimeStamp(startTime.toISOString());
      
      try {
        await enterFullscreen();
        socket.emit("startTimer", {
          userId: user.id,
          groupIds: group,
          startTime,
          endTime: new Date(startTime.getTime() + totalSeconds * 1000),
        });
        setIsRunning(true);
      } catch (err) {
        toast.error("Failed to start timer");
        console.error(err);
      }
    } else {
      handleTimerComplete();
    }
  };

  useEffect(() => {
    const handleTimerStarted = (data) => {
      console.log("Timer started:", data);
    };

    const handleTimerPaused = (data) => {
      console.log("Timer paused:", data);
    };

    socket.on("userStartedTimer", handleTimerStarted);
    socket.on("userPausedTimer", handleTimerPaused);

    return () => {
      socket.off("userStartedTimer", handleTimerStarted);
      socket.off("userPausedTimer", handleTimerPaused);
    };
  }, [socket]);

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <div
      ref={timerRef}
      className={`time-picker w-full max-w-2xl mx-auto p-8 rounded-2xl ${
        document.fullscreenElement 
          ? "bg-neutral-900 text-white h-screen flex items-center justify-center"
          : "bg-neutral-900 shadow-xl"
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Timer Header */}
        <div className="flex items-center space-x-3">
          <TimerIcon className="w-6 h-6 text-violet-400" />
          <h2 className="text-2xl font-bold text-white">
            Study Timer
          </h2>
        </div>

        {/* Timer Display */}
        <div className="time-picker__content">
          <div className="flex items-center justify-center gap-4">
            {Object.entries(time).map(([unit, value], index) => (
              <React.Fragment key={unit}>
                <div
                  className={`relative group ${isRunning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onWheel={(e) => !isRunning && handleScroll(e, unit)}
                  onClick={() => !isRunning && setEditingField(unit)}
                >
                  <label className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-gray-400">
                    {unit}
                  </label>
                  <div
                    className={`w-24 h-24 flex items-center justify-center rounded-xl text-4xl font-mono transition-all ${
                      isRunning 
                        ? 'bg-neutral-800 text-gray-400'
                        : 'bg-neutral-800 text-white hover:bg-neutral-700'
                    }`}
                  >
                    {editingField === unit ? (
                      <input
                        type="number"
                        className="w-16 bg-transparent text-center outline-none text-white"
                        value={value}
                        onChange={(e) => handleDirectInput(unit, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        disabled={isRunning}
                      />
                    ) : (
                      formatNumber(value)
                    )}
                  </div>
                </div>
                {index < 1 && (
                  <span className="text-4xl font-mono text-gray-400">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-6">
          <button
            onClick={toggleTimer}
            disabled={totalSeconds === 0}
            className={`p-4 rounded-full transition-all ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-violet-500 hover:bg-violet-600'
            } ${
              totalSeconds === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } text-white shadow-lg hover:shadow-xl`}
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-4 rounded-full transition-all bg-neutral-800 hover:bg-neutral-700 text-gray-300 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Timer Status */}
        {isRunning && (
          <p className="text-sm text-gray-400">
            Press ESC to exit fullscreen or click stop to end timer
          </p>
        )}
      </div>

      {/* Error Toast Style Override */}
      <style jsx global>{`
        .toast-error {
          background: #1f1f1f !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Timers;
