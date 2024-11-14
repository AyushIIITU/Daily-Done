import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const user=JSON.parse(localStorage.getItem("user"));
const Timers = ({socket,group}) => {
  // console.log(group)
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [editingField, setEditingField] = useState(null);

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
    const seconds = totalSeconds % 60;
    setTime({ hours, minutes, seconds });
  }, [totalSeconds]);

  const handleScroll = (e, unit) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    
    setTotalSeconds((prev) => {
      let newTotal = prev;
      
      switch(unit) {
        case 'hours':
          newTotal += delta * 3600;
          break;
        case 'minutes':
          newTotal += delta * 60;
          break;
        case 'seconds':
          newTotal += delta;
          break;
      }
      
      return Math.max(0, Math.min(359999, newTotal)); // Max 99:59:59
    });
  };

  const handleDirectInput = (unit, value) => {
    const numValue = parseInt(value) || 0;
    let newValue = Math.max(0, Math.min(unit === 'hours' ? 23 : 59, numValue));
    
    setTotalSeconds((prev) => {
      const hours = unit === 'hours' ? newValue : Math.floor(prev / 3600);
      const minutes = unit === 'minutes' ? newValue : Math.floor((prev % 3600) / 60);
      const seconds = unit === 'seconds' ? newValue : prev % 60;
      
      return hours * 3600 + minutes * 60 + seconds;
    });
  };

  const toggleTimer = () => {
    if(totalSeconds === 0) return;
    if(isRunning===false) {
    socket.emit('startTimer', { userId: user.id, groupIds: group, startTime: new Date(),endTime: new Date()+totalSeconds });
    }
    else {
      socket.emit('pauseTimer', { userId: user.id, groupIds: group, endTime: new Date() });
      }
    setIsRunning(!isRunning)
   
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-400 rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-2">
            <Timer className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Study Timer</h1>
          </div>
          
          <div className="flex items-center text-6xl font-mono text-white">
            {Object.entries(time).map(([unit, value], index) => (
              <React.Fragment key={unit}>
                <div
                  className="relative w-24 h-24 flex items-center justify-center bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                  onWheel={(e) => handleScroll(e, unit )}
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
                    />
                  ) : (
                    formatNumber(value)
                  )}
                </div>
                {index < 2 && <span className="mx-2">:</span>}
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
    // </div>
  );
};

export default Timers;