import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MemberCard({ member, type, socket, isOnline }) {
  const [time, setTime] = useState(() => {
    const studyTime = member?.studyTime || 0; // Ensure `studyTime` has a default value
    const hours = Math.floor(studyTime / (60 * 60 * 1000)); // Convert milliseconds to hours
    const minutes = Math.floor((studyTime % (60 * 60 * 1000)) / (60 * 1000)); // Remaining minutes
    return { hours, minutes };
  });

  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    const handleStartTimer = ({ userId, startTime }) => {
      if (member?.id === userId) {
        const start = new Date(startTime).getTime();

        // Clear any previous interval
        clearInterval(timerInterval);

        const interval = setInterval(() => {
          const now = new Date().getTime();
          const elapsed = now - start;

          const hours = Math.floor(elapsed / (60 * 60 * 1000));
          const minutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));

          setTime({ hours, minutes });
        }, 1000);

        setTimerInterval(interval);
      }
    };

    const handleStopTimer = ({ userId }) => {
      if (member?.id === userId) {
        clearInterval(timerInterval);
        setTimerInterval(null);
        setTime({ hours: 0, minutes: 0 });
      }
    };

    // Register socket event listeners
    socket.on("startTimer", handleStartTimer);
    socket.on("stopTimer", handleStopTimer);

    // Cleanup on component unmount
    return () => {
      clearInterval(timerInterval);
      socket.off("startTimer", handleStartTimer);
      socket.off("stopTimer", handleStopTimer);
    };
  }, [member?.id, socket, timerInterval]);

  return (
    <div className="flex items-center p-3 w-80 h-28 bg-white rounded-md shadow-lg">
      <div className="relative">
        <img className="w-12 h-12 rounded" src={member?.avatar} alt="" />
        <span
          className={`absolute bottom-0 left-8 transform translate-y-1/4 w-3.5 h-3.5 ${
            isOnline ? "bg-green-400" : "bg-red-400"
          } border-2 border-white dark:border-gray-800 rounded-full`}
        ></span>
      </div>

      <section className="block border-l border-gray-300 m-3">
        <div className="pl-3">
          <h3 className="text-gray-600 font-semibold text-sm">{member?.name}</h3>
          <div className="flex items-center justify-center w-full gap-3">
            <div className="timer">
              <div className="pl-2 relative bg-indigo-50 w-max">
                <h3 className="font-manrope font-semibold text-lg text-indigo-600 tracking-[15.36px] max-w-[44px] text-center">
                  {time.hours.toString().padStart(2, "0")}
                </h3>
              </div>
              <p className="text-sm font-normal text-gray-900 text-center">hours</p>
            </div>
            <div className="timer">
              <div className="pl-2 relative bg-indigo-50 w-max">
                <h3 className="font-manrope font-semibold text-lg text-indigo-600 tracking-[15.36px] max-w-[44px] text-center">
                  {time.minutes.toString().padStart(2, "0")}
                </h3>
              </div>
              <p className="text-sm font-normal text-gray-900 text-center">minutes</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2 pl-3">
          {member?.LeetCodeProfileName && (
            <Link
              to={`https://leetcode.com/${member?.LeetCodeProfileName}`}
              target="_blank"
            >
              {/* LeetCode SVG */}
            </Link>
          )}
          {member?.GitHubProfileName && (
            <Link
              to={`https://github.com/${member?.GitHubProfileName}`}
              target="_blank"
            >
              {/* GitHub SVG */}
            </Link>
          )}
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            {type}
          </span>
        </div>
      </section>
    </div>
  );
}

export default MemberCard;
