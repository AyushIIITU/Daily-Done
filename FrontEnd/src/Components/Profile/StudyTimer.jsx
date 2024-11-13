import React, { useState, useEffect } from "react";

function StudyTimer() {
  const [isChecked, setIsChecked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 28,
  });

  useEffect(() => {
    let timerInterval;
    if (isChecked) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          let { hours, minutes, seconds } = prevTime;

          if (seconds === 0) {
            if (minutes === 0) {
              if (hours === 0) {
                clearInterval(timerInterval);
                return { hours: 0, minutes: 0, seconds: 0 };
              } else {
                hours -= 1;
                minutes = 59;
                seconds = 59;
              }
            } else {
              minutes -= 1;
              seconds = 59;
            }
          } else {
            seconds -= 1;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval); // Clean up the interval on unmount or when isChecked changes
  }, [isChecked]);

  const handleOpenCheck = () => {
    setIsChecked((prev) => !prev);
    setOpenModal((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-4">
      <div className="flex space-x-4">
        <div className="flex flex-col items-center px-4">
          <span className="text-4xl lg:text-5xl text-gray-200">{timeLeft.hours}</span>
          <span className="text-gray-400 mt-2">Hours</span>
        </div>
        <span className="w-[1px] h-24 bg-gray-400"></span>
        <div className="flex flex-col items-center px-4">
          <span className="text-4xl lg:text-5xl text-gray-200">{timeLeft.minutes}</span>
          <span className="text-gray-400 mt-2">Minutes</span>
        </div>
        <span className="w-[1px] h-24 bg-gray-400"></span>
        <div className="flex flex-col items-center px-4">
          <span className="text-4xl lg:text-5xl text-gray-200">{timeLeft.seconds}</span>
          <span className="text-gray-400 mt-2">Seconds</span>
        </div>
      </div>

      <div>
        <input
          type="checkbox"
          id="checkbox"
          className="hidden peer"
          checked={isChecked}
          onChange={handleOpenCheck}
        />
        <label
          htmlFor="checkbox"
          className={`switch flex items-center justify-center gap-2 p-2.5 bg-gray-700 rounded-full text-white text-sm font-semibold cursor-pointer transition-all duration-300 
          ${isChecked ? "bg-purple-600 shadow-[0_0_40px_rgba(174,0,255,0.438)]" : ""}`}
        >
          Start Study
          <svg
            className="slider w-4 h-4 fill-current"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>
          </svg>
        </label>
      </div>

      {openModal && (
        <div
          id="progress-modal"
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
            >
              <svg className="w-3 h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
            <div className="p-4 md:p-5">
              <p className="text-gray-500 dark:text-gray-400 mb-6">Your study session is in progress.</p>
              <div className="flex justify-between mb-1 text-gray-500 dark:text-gray-400">
                <span className="text-base font-normal">My study time</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <div className="flex items-center mt-6 space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Upgrade to PRO
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyTimer;