import { useState, useEffect } from "react";
import Timers from "./Timer";

function StudyTimer({ socket, groupDetails }) {
  const ids = groupDetails?.filter(item => item && item._id).map(item => item._id) || [];
  const [openModal, setOpenModal] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [isStudying, setIsStudying] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('userStartedTimer', ({ userId, startTime, endTime }) => {
      console.log('Timer started by user:', userId, startTime, endTime);
    });

    socket.on('userPausedTimer', ({ userId, time }) => {
      console.log('Timer paused by user:', userId, time);
    });

    return () => {
      socket.off('userStartedTimer');
      socket.off('userPausedTimer');
    };
  }, [socket]);

  return (
    <div className="sm:w-1/2 w-full p-4 flex flex-col">
      <div className="flex-1">
        <Timers 
          socket={socket} 
          group={ids}
          onTimerStart={(time) => {
            setStudyTime(time);
            setIsStudying(true);
            setOpenModal(true);
          }}
          onTimerPause={(time) => {
            setStudyTime(time);
            setIsStudying(false);
          }}
        />
      </div>

      {openModal && (
        <div className="mt-4 bg-neutral-900 rounded-lg p-4">
          <p className="text-gray-400 mb-4">
            {isStudying ? "Your study session is in progress." : "Study session paused."}
          </p>
          <div className="flex justify-between mb-2 text-gray-400">
            <span className="text-base">Study time</span>
            <span className="text-sm font-semibold text-white">
              {Math.floor(studyTime / 3600)}h {Math.floor((studyTime % 3600) / 60)}m {studyTime % 60}s
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div 
              className="bg-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((studyTime / (8 * 3600)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyTimer;
