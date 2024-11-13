import { useEffect, useRef, useState } from "react";
import GroupIconSvg from "./GroupIconSvg";
import axios from "axios";
import { API } from "../../Utils/API";
import { Link } from "react-router-dom";
import GroupHeader from "./GroupHeader";
import PublicGroupSVG from "./PublicGroupSVG";
import MemberCard from "./MemberCard";
const user = JSON.parse(localStorage.getItem("user"));
const id = user?.id;
function GroupContainer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [GroupAllDetails, setGroupAllDetails] = useState([]);
  const [publicGroup, setPublicGroup] = useState([]);
  const refPassword = useRef();
  const refGroupId = useRef();
  const [GroupDetails, setGroupDetails] = useState();
  const [type, setType] = useState("Private");

  const fetchPublicGroup = async () => {
    try {
      const response = await axios.get(`${API}/api/group/public`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(response);
      setPublicGroup(response.data);
      console.log(response);
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
      setGroupAllDetails(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error in group", err);
    }
  };
  useEffect(() => {
    fetchGroupAllDetails();
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleOnPrivateJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/group/join/${id}`, {
        groupId: refGroupId.current.value,
        password: refPassword.current.value,
      });
      console.log(response);
    } catch (err) {
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
      console.log(data);
      const response = await axios.post(`${API}/api/group/join`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
    } catch (err) {
      console.error("Error in group", err);
    }
  };
  return (
    <>
      {!GroupDetails && (
        <div className="flex items-center justify-center h-96">
          {/* /* From Uiverse.io by EmaCoto  */}
          <button
            className="rounded-lg relative w-40 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
            onClick={() => setJoinGroupOpen(true)}
          >
            <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 group-hover:hidden transition-all duration-300">
              Join Group
            </span>
            <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
              <svg
                className="svg w-8 text-white"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </span>
          </button>
        </div>
      )}
      {GroupDetails && (
        <div className="container mx-auto border-red-400 border-solid border-2 ">
          <GroupHeader
            GroupDescription={GroupDetails?.description}
            GroupIcon={GroupDetails.avatar}
            GroupName={GroupDetails.name}
          />
          {/* {/* /* From Uiverse.io by EcheverriaJesus } */}
          <MemberCard member={GroupDetails.owner} type="Admin" />
          {GroupDetails.member.map((memb, index) => (
            <MemberCard key={index} member={memb} type="Member" />
          ))}
        </div>
      )}
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

        {/* Drawer Content Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 lg:grid-cols-4">
          {GroupAllDetails.map((item, index) => (
            <>
              <div
                key={index}
                className="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-700"
                onClick={() => setGroupDetails(item)}
              >
                {/* <div className="flex justify-center items-center p-2 mx-auto mb-2 bg-gray-200 dark:bg-gray-600 rounded-full w-[48px] h-[48px] max-w-[48px] max-h-[48px]"> */}
                <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
                  <div className="aspect-auto">
                    <img src={item.avatar} alt="Description of SVG" />
                  </div>
                </div>
                {/* </div> */}
                <div className="font-medium text-center text-gray-500 dark:text-gray-400">
                  {item.name}
                </div>
              </div>
            </>
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
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex gap-2 p-2">
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
              </div>
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => setJoinGroupOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                        {item?.members?.length > 0 && (
                          <div className="font-medium text-center text-gray-500 dark:text-gray-400">
                            {item.members.length} Members
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
    </>
  );
}

export default GroupContainer;
