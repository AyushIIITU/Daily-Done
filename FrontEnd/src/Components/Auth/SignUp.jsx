import axios from "axios";
import { useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { API } from "../../Utils/API";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProfileLogo } from "../../Constants/ProfileLogo";
function SignUp() {
  const refEmail = useRef();
  const refPassword = useRef();
  const refLeetCodeProfile = useRef();
  const refGitHubProfile = useRef();
  const [open, setOpen] = useState(false);
  const refName = useRef();
  const [logo, setLogo] = useState(ProfileLogo[0]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleLoginAuth = async (e) => {
    e.preventDefault();
    try {
      const email = refEmail.current.value;
      const password = refPassword.current.value;
      const leetcode = refLeetCodeProfile.current.value;
      const github = refGitHubProfile.current.value;
      const name = refName.current.value;
      const response = await axios.post(`${API}/api/user`, {
        email,
        password,
        leetcode,
        github,
        name,
        avatar: logo, 
      });
      console.log(response);
      if (response.status === 201) {
        toast.success("register");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-no-repeat bg-cover bg-center object-contain overflow-hidden flex w-full h-screen bg-gradient-to-r from-primary via-secondary to-tertiary animate-[AnimationName_3s_ease_infinite]">
        <div className="flex justify-center items-center w-full h-full">
          <form
            onSubmit={handleLoginAuth}
            className="w-[45vh] h-[66vh] mt-[4vh] m-[2vh] flex flex-col items-center justify-center bg-slate-100 p-[3vh] shadow-lg shadow-purple-300 relative overflow-hidden"
          >
            <p className="text-2xl font-bold text-gray-800 my-2 z-10">
              Sign Up
            </p>
            {/* <div className="absolute w-[300px] h-[300px] bg-primary rotate-45 -left-[180px] bottom-[30px] z-10 rounded-[30px] shadow-lg"></div> */}
            <img
              src={logo}
              alt="Company Logo"
              className="w-[18vh] z-10"
              onClick={() => setOpen(!open)}
            />

            <div className="relative w-full flex items-center justify-center z-10 mb-2">
              <CgProfile className="absolute left-[3px] w-4 h-4 text-gray-700" />
              <input
                type="Name"
                className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] focus:outline-none focus:border-purple-500"
                id="Name"
                placeholder="Name"
                ref={refName}
                required
              />
            </div>
            <div className="relative w-full flex items-center justify-center z-10 mb-2">
              <svg
                height="22"
                aria-hidden="true"
                viewBox="0 0 24 24"
                version="1.1"
                //   width="32"
                data-view-component="true"
                className="absolute left-[3px] w-4 h-4 text-gray-700"
              >
                <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
              </svg>
              <input
                type="GitHub"
                className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] focus:outline-none focus:border-purple-500"
                id="GitHub"
                placeholder="GitHub Profile"
                ref={refGitHubProfile}
                // required
              />
            </div>
            <div className="relative w-full flex items-center justify-center z-10 mb-2">
              <svg
                //   width="95"
                className="absolute left-[3px] w-4 h-4 text-gray-700"
                height="22"
                viewBox="0 0 95 111"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M68.0063 83.0664C70.5 80.5764 74.5366 80.5829 77.0223 83.0809C79.508 85.579 79.5015 89.6226 77.0078 92.1127L65.9346 103.17C55.7187 113.371 39.06 113.519 28.6718 103.513C28.6117 103.456 23.9861 98.9201 8.72653 83.957C-1.42528 74.0029 -2.43665 58.0749 7.11648 47.8464L24.9282 28.7745C34.4095 18.6219 51.887 17.5122 62.7275 26.2789L78.9048 39.362C81.6444 41.5776 82.0723 45.5985 79.8606 48.3429C77.6488 51.0873 73.635 51.5159 70.8954 49.3003L54.7182 36.2173C49.0488 31.6325 39.1314 32.2622 34.2394 37.5006L16.4274 56.5727C11.7767 61.5522 12.2861 69.574 17.6456 74.8292C28.851 85.8169 37.4869 94.2846 37.4969 94.2942C42.8977 99.496 51.6304 99.4184 56.9331 94.1234L68.0063 83.0664Z"
                  fill="#FFA116"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M41.1067 72.0014C37.5858 72.0014 34.7314 69.1421 34.7314 65.615C34.7314 62.0879 37.5858 59.2286 41.1067 59.2286H88.1245C91.6454 59.2286 94.4997 62.0879 94.4997 65.615C94.4997 69.1421 91.6454 72.0014 88.1245 72.0014H41.1067Z"
                  fill="#B3B3B3"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M49.9118 2.02335C52.3173 -0.55232 56.3517 -0.686894 58.9228 1.72277C61.494 4.13244 61.6284 8.17385 59.2229 10.7495L16.4276 56.5729C11.7768 61.552 12.2861 69.5738 17.6453 74.8292L37.4088 94.2091C39.9249 96.6764 39.968 100.72 37.505 103.24C35.042 105.761 31.0056 105.804 28.4895 103.337L8.72593 83.9567C-1.42529 74.0021 -2.43665 58.0741 7.1169 47.8463L49.9118 2.02335Z"
                  fill="black"
                ></path>
              </svg>
              <input
                type="LeetCode"
                className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] focus:outline-none focus:border-purple-500"
                id="LeetCode"
                placeholder="LeetCode Profile"
                ref={refLeetCodeProfile}
                // required
              />
            </div>
            <div className="relative w-full flex items-center justify-center z-10 mb-2">
              <svg
                className="absolute left-[3px] w-4 h-4 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
              </svg>
              <input
                type="email"
                className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] focus:outline-none focus:border-purple-500"
                id="email"
                placeholder="Email"
                ref={refEmail}
                required
              />
            </div>

            <div className="relative w-full flex items-center justify-center z-10 mb-4">
              <svg
                className="absolute left-[3px] w-4 h-4 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] pr-[30px] focus:outline-none focus:border-purple-500"
                id="password"
                placeholder="Password"
                ref={refPassword}
                required
              />
              <button
                type="button"
                className="absolute right-[3px] w-4 h-4 text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <input
              type="submit"
              id="button"
              value="Submit"
              className="relative z-10 rounded-[10px] w-full border-none bg-tertiary h-[30px] text-white text-sm font-medium tracking-wide mb-2 hover:bg-orange-600 cursor-pointer"
            />
          </form>
        </div>
      </div>

      {open && (
        <div
          id="popup-modal"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full  bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow ">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                onClick={() => setOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 overflow-auto">
                <div className="grid grid-cols-2  sm:grid-cols-6 sm:gap-1 gap-4">
                  {ProfileLogo.map((logo, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center cursor-pointer"
                      onClick={() => {
                        setLogo(logo);
                        setOpen(false);
                      }}
                    >
                      <img
                        src={logo}
                        alt="Company Logo"
                        className="w-24 h-24 sm:w-64 sm:h-32 sm:mx-2   object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;
