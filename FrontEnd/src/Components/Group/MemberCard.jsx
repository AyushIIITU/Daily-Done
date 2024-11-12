import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MemberCard({member,type}) {
    const [time, setTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    
      useEffect(() => {
        // Set initial countdown time here, e.g., 1 hour
        let countdownTime = 3600; // seconds
    
        const timerInterval = setInterval(() => {
          const hours = Math.floor(countdownTime / 3600);
          const minutes = Math.floor((countdownTime % 3600) / 60);
          const seconds = countdownTime % 60;
    
          setTime({ hours, minutes, seconds });
    
          countdownTime -= 1;
    
          // Stop the timer at 0
          if (countdownTime < 0) {
            clearInterval(timerInterval);
          }
        }, 1000);
    
        return () => clearInterval(timerInterval);
      }, []);
  return (
    <div className="flex items-center p-3 w-80 h-28 bg-white rounded-md shadow-lg">
            <div className="relative">
              <img className="w-12 h-12 rounded" src={member?.avatar} alt="" />
              <span className="absolute bottom-0 left-8 transform translate-y-1/4 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>

            <section className="block border-l border-gray-300 m-3">
              <div className="pl-3">
                <h3 className="text-gray-600 font-semibold text-sm">
                  {member?.name}
                </h3>
                <div className="flex items-center justify-center w-full gap-3 count-down-main">
                  <div className="timer">
                    <div className="pl-2 relative bg-indigo-50 w-max">
                      <h3 className="countdown-element days font-manrope font-semibold text-lg text-indigo-600 tracking-[15.36px] max-w-[44px] text-center relative z-20">
                        {time.hours.toString().padStart(2, "0")}
                      </h3>
                    </div>
                    <p className="text-sm font-normal text-gray-900 text-center w-full">
                      hours
                    </p>
                  </div>
                  <div className="timer">
                    <div className="pl-2 relative bg-indigo-50 w-max">
                      <h3 className="countdown-element minutes font-manrope font-semibold text-lg text-indigo-600 tracking-[15.36px] max-w-[44px] text-center relative z-20">
                        {time.minutes.toString().padStart(2, "0")}
                      </h3>
                    </div>
                    <p className="text-sm font-normal text-gray-900 text-center w-full">
                      minutes
                    </p>
                  </div>
                  <div className="timer">
                    <div className="pl-2 relative bg-indigo-50 w-max">
                      <h3 className="countdown-element seconds font-manrope font-semibold text-lg  text-indigo-600 tracking-[15.36px] max-w-[44px] text-center relative z-20">
                        {time.seconds.toString().padStart(2, "0")}
                      </h3>
                    </div>
                    <p className="text-sm font-normal text-gray-900 text-center w-full">
                      seconds
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2 pl-3">
                {member?.LeetCodeProfileName && (
                <Link to={`https://leetcode.com/u/${member?.LeetCodeProfileName}`} target='_blank'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-black stroke-2"
                    viewBox="0 0 24 24"
                    id="leetcode"
                  >
                    <path d="M20.303 16.047h-9.561c-.936 0-1.697-.803-1.697-1.79s.762-1.79 1.697-1.79h9.561c.936 0 1.697.803 1.697 1.79s-.762 1.79-1.697 1.79zm-9.561-2.58c-.385 0-.697.354-.697.79s.312.79.697.79h9.561c.385 0 .697-.354.697-.79s-.312-.79-.697-.79h-9.561z" />
                    <path d="M11.618 24c-1.604 0-2.977-.533-3.97-1.541L3.55 18.278C2.551 17.262 2 15.819 2 14.215c0-1.578.551-3.008 1.552-4.025L13.071.509c.66-.67 1.829-.652 2.506.036.694.706.71 1.839.034 2.524l-1.762 1.816a5.25 5.25 0 0 1 1.739 1.159l2.463 2.53c.672.684.655 1.815-.039 2.521a1.79 1.79 0 0 1-1.284.545c-.464 0-.896-.181-1.219-.509l-2.536-2.492c-.321-.327-.779-.49-1.367-.49-.606 0-1.069.157-1.375.469l-4.067 4.194c-.342.349-.521.831-.521 1.4 0 .577.189 1.101.519 1.436l4.083 4.182c.315.321.774.484 1.362.484s1.045-.163 1.36-.484l2.549-2.505a1.687 1.687 0 0 1 1.209-.503h.002c.483 0 .939.194 1.286.546.693.705.71 1.837.036 2.522l-2.457 2.525C14.586 23.438 13.176 24 11.618 24zM14.29 1a.703.703 0 0 0-.507.21l-9.519 9.681C3.449 11.72 3 12.9 3 14.215c0 1.341.449 2.535 1.265 3.363l.001.001 4.097 4.18C9.162 22.57 10.288 23 11.618 23c1.288 0 2.444-.455 3.258-1.282l2.457-2.525c.295-.301.279-.804-.034-1.122a.801.801 0 0 0-.573-.247h-.001a.703.703 0 0 0-.502.209l-2.549 2.505c-.497.507-1.214.778-2.068.778s-1.572-.271-2.076-.784L5.446 16.35c-.519-.527-.805-1.286-.805-2.136 0-.824.286-1.57.806-2.099l4.067-4.194c.503-.512 1.206-.771 2.091-.771.854 0 1.571.271 2.074.783l2.536 2.492a.705.705 0 0 0 .512.216.798.798 0 0 0 .571-.246c.313-.319.33-.822.037-1.121l-2.461-2.528a4.238 4.238 0 0 0-2.028-1.137c-.175-.041-.331-.176-.382-.349s-.021-.363.104-.492l2.325-2.398c.298-.302.282-.805-.031-1.124A.799.799 0 0 0 14.29 1z" />
                  </svg>
                </Link>)
                }
                {
                    member?.GitHubProfileName && (
                
                <Link to={`https://github.com/${member
                    ?.GitHubProfileName}`} target='_blank'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-black stroke-2"
                    xmlSpace="preserve"
                    viewBox="0 0 24 24"
                    id="github"
                  >
                    <path d="M14.5 23.862a.5.5 0 0 1-.5-.5v-3.72c0-.899-.115-1.537-.363-2.005a.5.5 0 0 1 .329-.72C16.93 16.233 19 14.064 19 11.642c0-1.2-.493-2.345-1.425-3.312a.5.5 0 0 1-.094-.558c.372-.802.293-1.894-.148-2.549-.583.228-1.34.705-1.832 1.289a.496.496 0 0 1-.554.147 8.67 8.67 0 0 0-5.893 0 .5.5 0 0 1-.554-.146c-.492-.584-1.249-1.061-1.833-1.289-.441.655-.52 1.747-.148 2.549a.498.498 0 0 1-.094.557C5.493 9.297 5 10.443 5 11.642c0 2.307 1.863 4.385 4.636 5.17a.501.501 0 0 1 .364.482v.349c0 .626-.251.979-.462 1.166-.452.397-1.036.337-1.1.33h-.01c-.824 0-1.444-.459-2.043-.903-.301-.223-.606-.45-.961-.638.077.104.153.211.23.318.75 1.043 1.599 2.226 2.847 2.226h1a.5.5 0 0 1 .5.5v2.72a.5.5 0 0 1-.608.488C3.95 22.642 0 17.719 0 12.142c0-6.617 5.383-12 12-12s12 5.383 12 12c0 5.576-3.95 10.5-9.392 11.708a.497.497 0 0 1-.108.012zm.258-6.121c.164.517.242 1.137.242 1.901v3.078c4.671-1.326 8-5.677 8-10.578 0-6.065-4.935-11-11-11s-11 4.935-11 11c0 4.901 3.329 9.252 8 10.578v-1.578h-.5c-1.76 0-2.813-1.465-3.659-2.643-.479-.667-.975-1.357-1.341-1.357a.5.5 0 0 1 0-1c1.74 0 2.705.715 3.48 1.29.536.397.958.71 1.52.71.056.003.263.018.379-.086.095-.086.119-.257.121-.392-3.006-.987-5-3.368-5-6.021 0-1.364.512-2.66 1.484-3.766-.429-1.243-.164-2.761.662-3.588a.494.494 0 0 1 .481-.13c.668.177 1.66.696 2.401 1.451a9.706 9.706 0 0 1 5.941 0c.741-.755 1.733-1.274 2.401-1.451a.493.493 0 0 1 .481.13c.827.827 1.091 2.345.662 3.587C19.488 8.983 20 10.279 20 11.642c0 2.728-2.127 5.17-5.242 6.099z" />
                  </svg>
                </Link>)}
                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  {type}
                </span>
              </div>
            </section>
          </div>
  )
}

export default MemberCard