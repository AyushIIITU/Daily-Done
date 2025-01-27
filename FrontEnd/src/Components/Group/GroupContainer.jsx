import { useEffect, useRef, useState } from "react";
import GroupIconSvg from "./GroupIconSvg";
import axios from "axios";
import { API } from "../../Utils/API";
import GroupHeader from "./GroupHeader";
import PublicGroupSVG from "./PublicGroupSVG";
import MemberCard from "./MemberCard";
import { io } from "socket.io-client";
import StudyTimer from "../Profile/StudyTimer";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Share2, Copy, Lock } from 'lucide-react';
const user = JSON.parse(localStorage.getItem("user"));
const id = user?.id;
const socket = io(API);

function GroupContainer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [GroupAllDetails, setGroupAllDetails] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const [publicGroup, setPublicGroup] = useState([]);
  const refPassword = useRef();
  const refGroupId = useRef();
  const [GroupDetails, setGroupDetails] = useState();
  const [type, setType] = useState("Private");
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchPublicGroup = async () => {
    try {
      const response = await axios.get(`${API}/api/group/public`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPublicGroup(response.data);
    } catch (err) {
      console.error("Error in group", err);
    }
  };
  const fetchGroupAllDetails = async () => {
    try {
      const response = await axios.get(`${API}/api/group/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Filter out any null or invalid groups
      const validGroups = response.data.filter(group => 
        group && group._id && group.owner && group.owner._id
      );
      
      setGroupAllDetails(validGroups);
      
      // If no group is selected yet, show the first valid group's details
      if (!GroupDetails && validGroups.length > 0) {
        setGroupDetails(validGroups[0]);
      }

      // Join socket rooms for all valid groups
      validGroups.forEach((group) => {
        if (group._id) {
          socket.emit("joinGroup", { userId: id, groupId: group._id });
        }
      });
    } catch (err) {
      console.error("Error in group", err);
      toast.error("Failed to fetch group details");
    }
  };
  useEffect(() => {
    fetchGroupAllDetails();
  }, []);
  useEffect(() => {
    socket.emit("customConnect", { userId: user?.id });
    console.log("connected", user?.id);
    socket.on("onlineUsers", (data) => {
      setOnlineUser(data);
    });

    return () => {
      socket.off("customConnect");
      socket.off("onlineUsers");
      socket.disconnect();
      console.log("Disconnected from Socket.io server");
    };
  }, [socket]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleOnPrivateJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API}/api/group/join`,
        {
          groupId: refGroupId.current.value,
          userId: id,
          password: refPassword.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchGroupAllDetails();
        setJoinGroupOpen(false);
        toast.success("Successfully joined the group!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join group");
      console.error("Error in group", err);
    }
  };
  const handlePublic = async (e) => {
    e.preventDefault();
    try {
      setType("Public");
      if (publicGroup.length <= 0) {
        await fetchPublicGroup();
      }
    } catch (err) {
      console.error("Error in group", err);
    }
  };
  const handleJoinPublic = async (groupId) => {
    try {
      const data = {
        groupId: groupId,
        userId: user.id,
      };
      const response = await axios.post(`${API}/api/group/join`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.status === 200) {
        // Refresh group list after joining
        await fetchGroupAllDetails();
        // Close the join modal
        setJoinGroupOpen(false);
        toast.success("Successfully joined the group!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join group");
      console.error("Error in group", err);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row justify-center min-h-[calc(100vh-78px)]">
        {/* Group Details Section */}
        <div className="sm:w-1/2 w-full flex flex-col p-4 bg-slate-800">
          {/* Main button container */}
          <div className="flex items-center w-1/2 justify-between bg-neutral-800 bg-opacity-80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg max-w-md mx-auto transition-all duration-300 hover:shadow-xl hover:bg-opacity-90 mb-4">
          

            <Link
              to="/createGroup"
              className="group rounded-lg flex items-center justify-start w-11 h-11 border-none  cursor-pointer relative overflow-hidden transition-all duration-300 hover:w-[125px] shadow-md bg-black active:translate-x-1 active:translate-y-1"
            >
              <div className="flex items-center justify-center group-hover:hidden w-full text-white text-2xl transition-all duration-300">
                +
              </div>
              <div className="absolute right-0 opacity-0 text-white text-lg font-medium transition-all duration-300 w-0 pr-0 group-hover:w-[70%] group-hover:opacity-100 group-hover:pr-5">
                Create
              </div>
            </Link>
            <button
              className="group rounded-lg flex items-center justify-start w-11 h-11 border-none  cursor-pointer relative overflow-hidden transition-all duration-300 hover:w-[100px] shadow-md bg-black active:translate-x-1 active:translate-y-1"
              onClick={() => setJoinGroupOpen(true)}
            >
              <div className="flex items-center justify-center group-hover:hidden w-full text-white text-2xl transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                   className="svg w-8 text-white"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="2.5"
                    stroke="#fff"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.7679 8.5C12.0332 8.04063 12.47 7.70543 12.9824 7.56815C13.4947 7.43086 14.0406 7.50273 14.5 7.76795C14.9594 8.03317 15.2946 8.47 15.4319 8.98236C15.5691 9.49472 15.4973 10.0406 15.2321 10.5C14.9668 10.9594 14.53 11.2946 14.0176 11.4319C13.5053 11.5691 12.9594 11.4973 12.5 11.2321C12.0406 10.9668 11.7054 10.53 11.5681 10.0176C11.4309 9.50528 11.5027 8.95937 11.7679 8.5L11.7679 8.5Z"
                    stroke="#fff"
                  />
                  <path
                    d="M13.4054 17.507L13.8992 17.4282L13.4054 17.507ZM12.5 18H3.50002V19H12.5V18ZM3.08839 17.5857C3.21821 16.7717 3.53039 15.6148 4.26396 14.671C4.97934 13.7507 6.11871 13 8.00002 13V12C5.80109 12 4.37371 12.9004 3.47442 14.0573C2.59334 15.1909 2.24293 16.5374 2.10087 17.4282L3.08839 17.5857ZM8.00002 13C9.88133 13 11.0207 13.7507 11.7361 14.671C12.4697 15.6148 12.7818 16.7717 12.9117 17.5857L13.8992 17.4282C13.7571 16.5374 13.4067 15.1909 12.5256 14.0573C11.6263 12.9004 10.199 12 8.00002 12V13ZM3.50002 18C3.20827 18 3.05697 17.7827 3.08839 17.5857L2.10087 17.4282C1.95832 18.322 2.6872 19 3.50002 19V18ZM12.5 19C13.3128 19 14.0417 18.322 13.8992 17.4282L12.9117 17.5857C12.9431 17.7827 12.7918 18 12.5 18V19Z"
                    fill="#fff"
                  />
                  <path
                    d="M17.2966 17.4162L16.8116 17.5377L17.2966 17.4162ZM11.8004 13.9808L11.5324 13.5586L11.0173 13.8855L11.4391 14.3264L11.8004 13.9808ZM13.4054 17.507L13.8992 17.4282L13.4054 17.507ZM16.3951 18H12.5V19H16.3951V18ZM16.8116 17.5377C16.8654 17.7526 16.7076 18 16.3951 18V19C17.2658 19 18.0152 18.2277 17.7816 17.2948L16.8116 17.5377ZM13.5001 14C14.5278 14 15.2496 14.5027 15.7784 15.2069C16.3178 15.9253 16.6345 16.8306 16.8116 17.5377L17.7816 17.2948C17.5905 16.5315 17.2329 15.4787 16.5781 14.6065C15.9126 13.7203 14.9202 13 13.5001 13V14ZM12.0683 14.4029C12.4581 14.1556 12.9262 14 13.5001 14V13C12.732 13 12.0787 13.2119 11.5324 13.5586L12.0683 14.4029ZM11.4391 14.3264C12.3863 15.3166 12.7647 16.6646 12.9116 17.5857L13.8992 17.4282C13.7397 16.4285 13.3158 14.8416 12.1617 13.6351L11.4391 14.3264ZM12.9116 17.5857C12.9431 17.7827 12.7918 18 12.5 18V19C13.3128 19 14.0417 18.322 13.8992 17.4282L12.9116 17.5857Z"
                    fill="#fff"
                  />
                  <rect
                    x="16.25"
                    y="5.25"
                  
                    rx="0.25"
                    stroke="#fff"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="18.75"
                    y="3.25"
                  
                    rx="0.25"
                    transform="rotate(90 18.75 3.25)"
                    stroke="#fff"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="absolute right-0 opacity-0 text-white text-lg font-medium transition-all duration-300 w-0 pr-0 group-hover:w-[70%] group-hover:opacity-100 group-hover:pr-5">
                Join
              </div>
            </button>
          </div>

          {/* Display Group Details if available */}
          {GroupDetails && GroupDetails.owner && (
            <div className="container mx-auto border-violet-400 border-solid rounded-t-lg min-h-[55vh] overflow-y-auto border-2 bg-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">
                  {GroupDetails.name}
                </h2>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              <GroupHeader
                GroupDescription={GroupDetails?.description || ""}
                GroupIcon={GroupDetails?.avatar}
                GroupName={GroupDetails?.name || ""}
              />
              <div className="flex flex-col p-4 ">
              {/* Member cards */}
              {GroupDetails.owner && (
                <MemberCard
                  member={GroupDetails.owner}
                  type="Admin"
                  socket={socket}
                  isOnline={onlineUser[GroupDetails.owner?._id] || false}
                  studyTime={GroupDetails.owner?.studyTime || 0}
                  status={GroupDetails.owner?.status || "Offline"}
                />
              )}
              
              {GroupDetails.member?.filter(Boolean).map((memb, index) => (
                <MemberCard
                  key={memb?._id || index}
                  member={memb}
                  type="Member"
                  isOnline={onlineUser[memb?._id] || false}
                  socket={socket}
                  studyTime={memb?.studyTime || 0}
                  status={memb?.status || "Offline"}
                />
              ))}
              </div>
            </div>
          )}
        </div>

        {/* Study Timer Section */}
        <StudyTimer socket={socket} groupDetails={GroupAllDetails} />
      </div>
      {/* Drawer Swipe */}
      <div
        id="drawer-swipe"
        className={`fixed z-40 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform  left-0 right-0 ${
          isDrawerOpen
            ? "translate-y-0 bottom-0"
            : "translate-y-full bottom-[60px]"
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-swipe-label"
      >
        {/* Drawer Header */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={toggleDrawer}
        >
          <span className="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
          <h5
            id="drawer-swipe-label"
            className="inline-flex items-center text-base text-gray-500 dark:text-gray-400 font-medium"
          >
            <GroupIconSvg />
            Groups
          </h5>
        </div>

        {/* Drawer Content Grid with null checks */}
        <div className="grid grid-cols-3 gap-4 p-4 lg:grid-cols-4">
          {GroupAllDetails.filter(item => item && item._id && item.owner).map((item, index) => (
            <div
              key={item._id || index}
              className={`p-4 rounded-lg cursor-pointer ${
                GroupDetails?._id === item._id
                  ? "bg-violet-100 hover:bg-violet-200"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => setGroupDetails(item)}
            >
              <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
                <img src={item.avatar || ''} alt={item.name || ''} className="aspect-auto" />
              </div>
              <div className="font-medium text-center text-gray-700 mt-2">
                {item.name || 'Unnamed Group'}
              </div>
              <div className="text-sm text-center text-gray-500">
                {item.owner?._id === id ? "Created by you" : "Joined"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <!-- Main modal --> */}
      {joinGroupOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto top-[25vh]">
            {/* <!-- Modal content --> */}
            
            <div className="relative bg-white rounded-lg shadow ">
              {/* <!-- Modal header --> */}
              
              <div className="flex gap-2 p-2 justify-between">
                <div>
                  <input
                    className="peer sr-only"
                    value="Private"
                    name="gender"
                    id="Private"
                    checked={type === "Private"}
                    onChange={() => setType("Private")}
                    type="radio"
                  />
                  <div className="flex h-16 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-green-400 active:scale-95 peer-checked:border-green-500 peer-checked:shadow-md peer-checked:shadow-green-400">
                    <label
                      className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-green-500"
                      htmlFor="Private"
                    >
                      <svg
                        id="Private"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-6 fill-gray-100"
                        viewBox="0 0 1024 1024"
                      >
                        <circle
                          cx="512"
                          cy="512"
                          r="512"
                          style={{ fill: "#56b14e" }}
                        />
                        <path
                          data-name="PIA logo (monochrome version by krisu)"
                          d="M486.59 371c0-15.43-18.66-23.16-29.57-12.26s-3.19 29.58 12.24 29.58a17.32 17.32 0 0 0 17.32-17.33m68.18-17.31c-15.43 0-23.18 18.65-12.26 29.57s29.58 3.17 29.57-12.26a17.31 17.31 0 0 0-17.31-17.31m-18.66 45.89a36 36 0 0 1-48.17 0c-4.37-3.69-10.12 2.53-6.09 6.6a44 44 0 0 0 60.37 0 4.5 4.5 0 0 0-6.11-6.6m159.63 67v-.25a36.09 36.09 0 0 0-26.22-34.7v-30.91A152.73 152.73 0 0 0 516.79 248h-5.84a152.73 152.73 0 0 0-152.73 152.71v30.12A36.09 36.09 0 0 0 328.59 466a51.34 51.34 0 0 0-7.09 26v195.85a51.54 51.54 0 0 0 38.1 49.74A37.7 37.7 0 0 0 394.06 760h42.84a37.69 37.69 0 0 0 33.6-20.59h78.59A37.68 37.68 0 0 0 582.66 760h42.85a37.72 37.72 0 0 0 34-21.37 51.57 51.57 0 0 0 43-50.82V492.06a51.31 51.31 0 0 0-6.78-25.49zM559.55 656.36a23.1 23.1 0 0 1-22.84 26.46H487.3a23.12 23.12 0 0 1-22.85-26.44l9.55-64.56a58.61 58.61 0 0 1 31.4-102.87A58.62 58.62 0 0 1 550 591.83zm5.58-215.88h-106A35.88 35.88 0 0 0 434 430.24h-18v-32.06a95.65 95.65 0 0 1 95.62-95.64h4.67a95.65 95.65 0 0 1 95.62 95.64v32.06h-21.6a35.89 35.89 0 0 0-25.18 10.24zm-21.94 219a5.49 5.49 0 0 1-5.37 6.89h-51.33a5.48 5.48 0 0 1-5.36-6.91l9.87-71.23a8.49 8.49 0 0 0-.44-3.13 16 16 0 0 0-3.16-3.21c-.18-.15-.31-.26-.42-.36a42.24 42.24 0 1 1 50.43-.31c0 .07-.16.28-.65.68a16 16 0 0 0-3.16 3.21 5.22 5.22 0 0 0-.32 1.42z"
                          style={{ fill: "#fff" }}
                        />
                      </svg>
                      Private
                    </label>
                  </div>
                </div>
                <div>
                  <input
                    className="peer sr-only"
                    value="Public"
                    name="gender"
                    id="Public"
                    checked={type === "Public"}
                    onChange={handlePublic}
                    type="radio"
                  />
                  <div className="flex h-16 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-blue-400 active:scale-95 peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-400">
                    <label
                      className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-blue-500"
                      htmlFor="Public"
                    >
                      <PublicGroupSVG />
                      Public
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setJoinGroupOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
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
              </div>
             
              {/* <!-- Modal body --> */}
              {type === "Private" && (
                <form
                  onSubmit={handleOnPrivateJoin}
                  className="p-4 md:p-5 space-y-4"
                >
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      placeholder=""
                      ref={refGroupId}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    />
                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      GroupId
                    </label>
                  </div>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      placeholder=""
                      ref={refPassword}
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    />
                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      Password
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-green-500 text-white rounded-lg"
                  >
                    Join Group
                  </button>
                </form>
              )}
              {type === "Public" && (
                <div className="p-4 md:p-5 space-y-4">
                  {publicGroup.map((item, index) => (
                    <>
                      <div
                        key={index}
                        className="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-700"
                        onClick={() => setGroupDetails(item)}
                      >
                        <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
                          <div className="aspect-auto">
                            <img src={item.avatar} alt="Description of SVG" />
                          </div>
                        </div>
                        <div className="font-medium text-center text-gray-500 dark:text-gray-400">
                          {item.name}
                        </div>
                        {item?.member?.length > 0 && (
                          <div className="font-medium text-center text-gray-500 dark:text-gray-400">
                            {item.member.length} Members
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={async () =>
                            await handleJoinPublic(item?._id)
                          }
                          className="w-full py-2 bg-green-500 text-white rounded-lg"
                        >
                          Join Group
                        </button>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && GroupDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Share Group</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Group Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-300">{GroupDetails.name}</span>
                {GroupDetails.type === "Private" && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-400">
                {GroupDetails.type === "Private" 
                  ? "Share these details with people you want to invite:"
                  : "Anyone can join with this link:"}
              </p>
            </div>

            {/* Share Link */}
            <div className="mb-4">
              <div className="flex items-center gap-2 p-3 bg-neutral-700 rounded-lg">
                {
                  GroupDetails.type === "Public" ? (
                    <>
                    <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/group/public/${GroupDetails._id}`}
                  className="flex-1 bg-transparent text-white outline-none"
                />
                <button
                  onClick={() => copyToClipboard(`${window.location.origin}/group/public/${GroupDetails._id}`)}
                  className="p-2 hover:bg-neutral-600 rounded-lg transition-all"
                >
                  <Copy className="w-4 h-4 text-gray-300" />
                </button>
                    </>
                ) : (
                  <>
                  <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/group/private/${GroupDetails._id}`}
                  className="flex-1 bg-transparent text-white outline-none"
                />
                <button
                  onClick={() => copyToClipboard(`${window.location.origin}/group/private/${GroupDetails._id}`)}
                  className="p-2 hover:bg-neutral-600 rounded-lg transition-all"
                >
                  <Copy className="w-4 h-4 text-gray-300" />
                </button>
                  </>
                )}
                
              </div>
            </div>

            {/* Private Group Password */}
            {GroupDetails.type === "Private" && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Group Password
                </label>
                <div className="flex items-center gap-2 p-3 bg-neutral-700 rounded-lg">
                  <input
                    type="text"
                    readOnly
                    value={GroupDetails.password}
                    className="flex-1 bg-transparent text-white outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(GroupDetails.password)}
                    className="p-2 hover:bg-neutral-600 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupContainer;
