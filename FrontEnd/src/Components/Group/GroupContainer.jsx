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
                <h2 className="text-white text-xl py-2 px-4 font-semibold">
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
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm"
        >
          <div className="relative p-4 w-full max-w-2xl">
            {/* Modal content */}
            <div className="relative bg-neutral-800 rounded-2xl shadow-xl">
              {/* Modal header */}
              <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-neutral-700">
                {/* Private Option */}
                <div className="flex-1">
                  <input
                    className="peer sr-only"
                    value="Private"
                    name="groupType"
                    id="Private"
                    checked={type === "Private"}
                    onChange={() => setType("Private")}
                    type="radio"
                  />
                  <div className="flex h-20 cursor-pointer items-center justify-center rounded-xl border-2 border-neutral-600 bg-neutral-700/50 p-4 transition-all duration-300 hover:border-violet-400 hover:bg-neutral-700 active:scale-95 peer-checked:border-violet-500 peer-checked:bg-violet-500/10">
                    <label
                      className="flex cursor-pointer items-center gap-3 text-base font-medium text-gray-400 peer-checked:text-violet-500"
                      htmlFor="Private"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Private Group
                    </label>
                  </div>
                </div>

                {/* Public Option */}
                <div className="flex-1">
                  <input
                    className="peer sr-only"
                    value="Public"
                    name="groupType"
                    id="Public"
                    checked={type === "Public"}
                    onChange={handlePublic}
                    type="radio"
                  />
                  <div className="flex h-20 cursor-pointer items-center justify-center rounded-xl border-2 border-neutral-600 bg-neutral-700/50 p-4 transition-all duration-300 hover:border-violet-400 hover:bg-neutral-700 active:scale-95 peer-checked:border-violet-500 peer-checked:bg-violet-500/10">
                    <label
                      className="flex cursor-pointer items-center gap-3 text-base font-medium text-gray-400 peer-checked:text-violet-500"
                      htmlFor="Public"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Public Group
                    </label>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setJoinGroupOpen(false)}
                  className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
             
              {/* Modal body */}
              {type === "Private" && (
                <form onSubmit={handleOnPrivateJoin} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Group ID"
                        ref={refGroupId}
                        className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password"
                        ref={refPassword}
                        className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Join Private Group
                  </button>
                </form>
              )}

              {type === "Public" && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {publicGroup.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border border-neutral-600 transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                            <img 
                              src={item.avatar} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white mb-1">
                              {item.name}
                            </h3>
                            {item?.member?.length > 0 && (
                              <p className="text-sm text-gray-400">
                                {item.member.length} Members
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleJoinPublic(item?._id)}
                          className="w-full py-2.5 px-4 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <span>Join Group</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
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
