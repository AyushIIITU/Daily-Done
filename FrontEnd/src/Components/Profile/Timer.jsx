import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

const user = JSON.parse(localStorage.getItem("user"));

const Timers = ({ socket, group }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [editingField, setEditingField] = useState(null);
  const timerRef = useRef(null); // Ref for the timer container

  useEffect(() => {
    let interval;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setTime({ hours, minutes });
  }, [totalSeconds]);

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

  const handleScroll = (e, unit) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;

    setTotalSeconds((prev) => {
      let newTotal = prev;

      switch (unit) {
        case "hours":
          newTotal += delta * 3600;
          break;
        case "minutes":
          newTotal += delta * 60;
          break;
        default:
          break;
      }

      return Math.max(0, Math.min(359999, newTotal));
    });
  };

  const handleDirectInput = (unit, value) => {
    const numValue = parseInt(value) || 0;
    let newValue = Math.max(0, Math.min(unit === "hours" ? 23 : 59, numValue));

    setTotalSeconds((prev) => {
      const hours = unit === "hours" ? newValue : Math.floor(prev / 3600);
      const minutes =
        unit === "minutes" ? newValue : Math.floor((prev % 3600) / 60);

      return hours * 3600 + minutes * 60;
    });
  };

  const toggleTimer = () => {
    if (totalSeconds === 0) return;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    if (!isRunning) {
      enterFullscreen();
      socket.emit("startTimer", {
        userId: user.id,
        groupIds: group,
        startTime,
        endTime,
      });
      console.log("Timer Started");
    } else {
      exitFullscreen();
      socket.emit("pauseTimer", {
        userId: user.id,
        groupIds: group,
        endTime: new Date(),
      });
      console.log("Timer Paused");
    }

    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    exitFullscreen();
  };

  const formatNumber = (num) => num.toString().padStart(2, "0");

  // Fullscreen handling
  const enterFullscreen = () => {
    if (timerRef.current.requestFullscreen) {
      timerRef.current.requestFullscreen();
    } else if (timerRef.current.webkitRequestFullscreen) {
      timerRef.current.webkitRequestFullscreen();
    } else if (timerRef.current.mozRequestFullScreen) {
      timerRef.current.mozRequestFullScreen();
    } else if (timerRef.current.msRequestFullscreen) {
      timerRef.current.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsRunning(false); // Pause the timer if fullscreen mode is exited
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
// ""
// bg-white/10 backdrop-blur-lg w-full sm:w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-400 rounded-2xl p-8 shadow-xl border border-white/20 
return (
    <div
      ref={timerRef}
      className="group overflow-hidden  w-full sm:w-1/2  relative after:duration-500 before:duration-500  duration-500 hover:after:duration-500 hover:after:translate-x-24 hover:before:translate-y-12 hover:before:-translate-x-32 hover:duration-500 after:absolute after:w-24 after:h-24 after:bg-sky-700 after:rounded-full  after:blur-xl after:bottom-32 after:right-16 after:w-12 after:h-12  before:absolute before:w-20 before:h-20 before:bg-sky-400 before:rounded-full  before:blur-xl before:top-20 before:right-16 before:w-12 before:h-12 flex justify-center items-center  origin-bottom-right bg-neutral-900 rounded-2xl outline outline-slate-400 -outline-offset-8"
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center space-x-2">
          <Timer className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Study Timer</h1>
        </div>

        <div className="flex items-center text-6xl font-mono text-white">
          {Object.entries(time).map(([unit, value], index) => (
            <React.Fragment key={index}>
              <div
                className="relative w-24 h-24 flex items-center justify-center bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                onWheel={(e) => handleScroll(e, unit)}
                onClick={() => setEditingField(unit)}
              >
                {editingField === unit ? (
                  <input
                    type="number"
                    className="w-full h-full text-center bg-transparent outline-none"
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
              {index < 1 && <span className="mx-2">:</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            disabled={totalSeconds === 0}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timers;
