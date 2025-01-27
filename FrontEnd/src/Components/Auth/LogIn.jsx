// import "./LoginIn.css";
// import IIITUNA from "../../Images/IIITULogo.png";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../Utils/API";
import axios from "axios";
import toast, { ToastBar } from "react-hot-toast";
// import axios from "axios";
// import second from ''

function LoginIn() {
  const refEmail = useRef();
  const refPassword = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleLoginAuth = async (event) => {
    event.preventDefault();

    const email = refEmail.current.value;
    const password = refPassword.current.value;

    try {
      const response = await axios.post(`${API}/api/user/login`, {
        email: email,
        password: password
      });
      console.log(response.data);
      if(response.status===200){
        toast.success("Login");
        localStorage.setItem('token',response.data.token);
        console.log(response.data
        );
        const userData=JSON.stringify(
          response.data.userData
        );
        localStorage.setItem('user',userData);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response.data?.error);
      console.log("Error in Authorization:", error);
    }
  };

  return (
    <div className="bg-no-repeat bg-cover bg-center object-contain overflow-hidden flex w-full h-screen bg-gradient-to-r from-primary via-secondary to-tertiary animate-[AnimationName_3s_ease_infinite]">
      <div className="flex justify-center items-center w-full h-full">
        <form onSubmit={handleLoginAuth} className="w-[45vh] h-[66vh] mt-[4vh] m-[2vh] flex flex-col items-center justify-center bg-slate-100 p-[3vh] shadow-lg shadow-purple-300 relative overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-[#F099F9] rotate-45 -left-[180px] bottom-[30px] z-10 rounded-[30px] shadow-lg"></div>
          <img
            src={'/LOGO1.svg'}
            alt="Company Logo"
            className="w-[18vh] z-20"
          />
          <p className="text-2xl font-bold text-gray-800 my-2 z-20">Login</p>
          <div className="relative w-full flex items-center justify-center z-20 mb-2">
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

          <div className="relative w-full flex items-center justify-center z-20 mb-4">
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
              className="w-full h-[30px] bg-transparent border-none border-b-2 border-gray-400 text-black text-sm font-medium pl-[30px] focus:outline-none focus:border-purple-500"
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

          <input type="submit" id="button" value="Submit" className="relative z-20 rounded-[10px] w-full border-none bg-tertiary h-[30px] text-white text-sm font-medium tracking-wide mb-2 hover:bg-orange-600 cursor-pointer" />
          <a className="relative z-20 text-xs font-medium text-indigo-700 no-underline p-2 rounded-[20px]" href="#">
            Forgot your password?
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginIn;
