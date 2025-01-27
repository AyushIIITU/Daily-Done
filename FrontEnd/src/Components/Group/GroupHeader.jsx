// import React from 'react'

function GroupHeader({GroupIcon, GroupName, GroupDescription}) {
  return (
    <div
      id="toast-notification"
      className="w-full p-4 text-gray-900 bg-white rounded-t-lg shadow dark:bg-gray-800 dark:text-gray-300"
      role="alert"
    >
      <div className="flex items-center">
        <div className="relative inline-block shrink-0">
          <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
            <div className="aspect-auto">
              <img src={GroupIcon} alt={GroupName} />
            </div>
          </div>
        </div>
        <div className="ms-3">
          <h3 className="text-lg font-semibold  text-white">
            {GroupName}
          </h3>
          <div className="text-sm font-normal text-gray-300">
            {GroupDescription}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupHeader;