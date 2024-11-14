import React, { useState } from "react";
import GitHubHeatmap from "./GitHubHeatMap";
import { SkillCard } from "./SkillCard";
import { Link } from "react-router-dom";
import { SKILL_COLORS } from "../../Constants/Skills";
import axios from "axios";
import { API } from "../../Utils/API";
import StudyTimer from "./StudyTimer";
import Timers from "./Timer";

function EditableProfile({ userData }) {
  console.log(userData);
  const [isModalOpen, setModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredSkills = Object.keys(SKILL_COLORS)
    .filter((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((skill) => !userData.skills.includes(skill));

  const addSkill = async (skill) => {
    if (!userData.skills.includes(skill)) {
      try {
        const response = await axios.patch(
          `${API}/api/user/addskill/${userData.id}`,
          { skill: skill },

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log(response.data);
        userData.skills.push(skill);
        setModalOpen(false);
      } catch (err) {
        console.error(err);
      }
    }
    setModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
              {/* <p className="text-xl mb-4">Full Stack Developer</p> */}
              <div className="flex gap-4">
                <Link
                  to={`https://github.com/${userData.GitHubProfileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-black stroke-2"
                    xmlSpace="preserve"
                    viewBox="0 0 24 24"
                    id="github"
                  >
                    <path d="M14.5 23.862a.5.5 0 0 1-.5-.5v-3.72c0-.899-.115-1.537-.363-2.005a.5.5 0 0 1 .329-.72C16.93 16.233 19 14.064 19 11.642c0-1.2-.493-2.345-1.425-3.312a.5.5 0 0 1-.094-.558c.372-.802.293-1.894-.148-2.549-.583.228-1.34.705-1.832 1.289a.496.496 0 0 1-.554.147 8.67 8.67 0 0 0-5.893 0 .5.5 0 0 1-.554-.146c-.492-.584-1.249-1.061-1.833-1.289-.441.655-.52 1.747-.148 2.549a.498.498 0 0 1-.094.557C5.493 9.297 5 10.443 5 11.642c0 2.307 1.863 4.385 4.636 5.17a.501.501 0 0 1 .364.482v.349c0 .626-.251.979-.462 1.166-.452.397-1.036.337-1.1.33h-.01c-.824 0-1.444-.459-2.043-.903-.301-.223-.606-.45-.961-.638.077.104.153.211.23.318.75 1.043 1.599 2.226 2.847 2.226h1a.5.5 0 0 1 .5.5v2.72a.5.5 0 0 1-.608.488C3.95 22.642 0 17.719 0 12.142c0-6.617 5.383-12 12-12s12 5.383 12 12c0 5.576-3.95 10.5-9.392 11.708a.497.497 0 0 1-.108.012zm.258-6.121c.164.517.242 1.137.242 1.901v3.078c4.671-1.326 8-5.677 8-10.578 0-6.065-4.935-11-11-11s-11 4.935-11 11c0 4.901 3.329 9.252 8 10.578v-1.578h-.5c-1.76 0-2.813-1.465-3.659-2.643-.479-.667-.975-1.357-1.341-1.357a.5.5 0 0 1 0-1c1.74 0 2.705.715 3.48 1.29.536.397.958.71 1.52.71.056.003.263.018.379-.086.095-.086.119-.257.121-.392-3.006-.987-5-3.368-5-6.021 0-1.364.512-2.66 1.484-3.766-.429-1.243-.164-2.761.662-3.588a.494.494 0 0 1 .481-.13c.668.177 1.66.696 2.401 1.451a9.706 9.706 0 0 1 5.941 0c.741-.755 1.733-1.274 2.401-1.451a.493.493 0 0 1 .481.13c.827.827 1.091 2.345.662 3.587C19.488 8.983 20 10.279 20 11.642c0 2.728-2.127 5.17-5.242 6.099z" />
                  </svg>
                </Link>
                <Link
                  to={`https://leetcode.com/${userData.LeetCodeProfileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-black stroke-2"
                    viewBox="0 0 24 24"
                    id="leetcode"
                  >
                    <path d="M20.303 16.047h-9.561c-.936 0-1.697-.803-1.697-1.79s.762-1.79 1.697-1.79h9.561c.936 0 1.697.803 1.697 1.79s-.762 1.79-1.697 1.79zm-9.561-2.58c-.385 0-.697.354-.697.79s.312.79.697.79h9.561c.385 0 .697-.354.697-.79s-.312-.79-.697-.79h-9.561z" />
                    <path d="M11.618 24c-1.604 0-2.977-.533-3.97-1.541L3.55 18.278C2.551 17.262 2 15.819 2 14.215c0-1.578.551-3.008 1.552-4.025L13.071.509c.66-.67 1.829-.652 2.506.036.694.706.71 1.839.034 2.524l-1.762 1.816a5.25 5.25 0 0 1 1.739 1.159l2.463 2.53c.672.684.655 1.815-.039 2.521a1.79 1.79 0 0 1-1.284.545c-.464 0-.896-.181-1.219-.509l-2.536-2.492c-.321-.327-.779-.49-1.367-.49-.606 0-1.069.157-1.375.469l-4.067 4.194c-.342.349-.521.831-.521 1.4 0 .577.189 1.101.519 1.436l4.083 4.182c.315.321.774.484 1.362.484s1.045-.163 1.36-.484l2.549-2.505a1.687 1.687 0 0 1 1.209-.503h.002c.483 0 .939.194 1.286.546.693.705.71 1.837.036 2.522l-2.457 2.525C14.586 23.438 13.176 24 11.618 24zM14.29 1a.703.703 0 0 0-.507.21l-9.519 9.681C3.449 11.72 3 12.9 3 14.215c0 1.341.449 2.535 1.265 3.363l.001.001 4.097 4.18C9.162 22.57 10.288 23 11.618 23c1.288 0 2.444-.455 3.258-1.282l2.457-2.525c.295-.301.279-.804-.034-1.122a.801.801 0 0 0-.573-.247h-.001a.703.703 0 0 0-.502.209l-2.549 2.505c-.497.507-1.214.778-2.068.778s-1.572-.271-2.076-.784L5.446 16.35c-.519-.527-.805-1.286-.805-2.136 0-.824.286-1.57.806-2.099l4.067-4.194c.503-.512 1.206-.771 2.091-.771.854 0 1.571.271 2.074.783l2.536 2.492a.705.705 0 0 0 .512.216.798.798 0 0 0 .571-.246c.313-.319.33-.822.037-1.121l-2.461-2.528a4.238 4.238 0 0 0-2.028-1.137c-.175-.041-.331-.176-.382-.349s-.021-.363.104-.492l2.325-2.398c.298-.302.282-.805-.031-1.124A.799.799 0 0 0 14.29 1z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => setModalOpen(true)}
          type="button"
          className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              className=" stroke-purple-400 fill-none group-hover:fill-purple-800 group-active:stroke-purple-500 group-active:fill-purple-600 group-active:duration-0 duration-300"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
            {/* <svg className="" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> */}
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
            Add Skill
          </span>
          <span className="relative invisible">Add Skill</span>
        </button>

        {isModalOpen && (
          <div className="fixed  inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-1/2 sm:h-1/2 h-2/3 p-6 rounded-lg shadow-lg ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900 ">Skills</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
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
              <input
                type="text"
                placeholder="Search for a skill"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="space-y-2 overflow-y-scroll sm:h-[calc(50%+12px)] h-[calc(67%+12px)] ">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="block w-full text-left p-2 rounded bg-blue-100 hover:bg-blue-200"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* <SkillCard category="Frontend Skills" skills={frontendSkills} /> */}

            <SkillCard skills={userData.skills} />
          </div>
          <>
            {/* <StudyTimer /> */}
          </>
          {/* <StudyTimeGraph data={studyData} /> */}
        </div>

        <div className="mt-12 space-y-8">
          <div className="flex flex-col items-center mb-6 overflow-hidden">
            <img
              src={`https://leetcard.jacoblin.cool/${userData?.LeetCodeProfileName}?ext=heatmap`}
              alt={`${userData?.LeetCodeProfileName}'s LeetCode Card`}
              className="rounded-lg shadow-lg w-80 sm:w-96 mb-4"
            />
            {userData?.GitHubProfileName && (
              <GitHubHeatmap username={userData?.GitHubProfileName} />
            )}
          </div>
          {/* <ActivityHeatmap title="GitHub Contributions" data={githubData} />
        <ActivityHeatmap title="LeetCode Activity" data={leetcodeData.submissions} />
        <ActivityHeatmap title="Website Activity" data={websiteHeatmap} /> */}
        </div>
      </div>
      <Timers/>
    </div>

  );
}

export default EditableProfile;
