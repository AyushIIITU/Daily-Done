import React, { useState } from "react";
import GitHubHeatmap from "./GitHubHeatMap";
import { SkillCard } from "./SkillCard";
import { Link } from "react-router-dom";
import { SKILL_COLORS } from "../../Constants/Skills";
import axios from "axios";
import { API } from "../../Utils/API";
import { motion } from "framer-motion";
// import StudyTimer from "./StudyTimer";
// import Timers from "./Timer";
import StudyGraph from "./StudyTimeGraph";

function EditableProfile({ userData }) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image Animation */}
            <motion.img
              src={userData.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <div>
              <motion.h1
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {userData.name}
              </motion.h1>

              {/* Social Links */}
              <div className="flex gap-4">
                {/* GitHub Link */}
                <motion.div
                  whileHover={{ scale: 1.25, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`https://github.com/${userData.GitHubProfileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 fill-black"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.5 23.862a.5.5 0 0 1-.5-.5v-3.72c0-.899-.115-1.537-.363-2.005a.5.5 0 0 1 .329-.72C16.93 16.233 19 14.064 19 11.642c0-1.2-.493-2.345-1.425-3.312a.5.5 0 0 1-.094-.558c.372-.802.293-1.894-.148-2.549-.583.228-1.34.705-1.832 1.289a.496.496 0 0 1-.554.147 8.67 8.67 0 0 0-5.893 0 .5.5 0 0 1-.554-.146c-.492-.584-1.249-1.061-1.833-1.289-.441.655-.52 1.747-.148 2.549a.498.498 0 0 1-.094.557C5.493 9.297 5 10.443 5 11.642c0 2.307 1.863 4.385 4.636 5.17a.501.501 0 0 1 .364.482v.349c0 .626-.251.979-.462 1.166-.452.397-1.036.337-1.1.33h-.01c-.824 0-1.444-.459-2.043-.903-.301-.223-.606-.45-.961-.638.077.104.153.211.23.318.75 1.043 1.599 2.226 2.847 2.226h1a.5.5 0 0 1 .5.5v2.72a.5.5 0 0 1-.608.488C3.95 22.642 0 17.719 0 12.142c0-6.617 5.383-12 12-12s12 5.383 12 12c0 5.576-3.95 10.5-9.392 11.708a.497.497 0 0 1-.108.012z" />
                    </svg>
                  </Link>
                </motion.div>

                {/* LeetCode Link */}
                <motion.div
                  whileHover={{ scale: 1.25, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`https://leetcode.com/${userData.LeetCodeProfileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 fill-black"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.303 16.047h-9.561c-.936 0-1.697-.803-1.697-1.79s.762-1.79 1.697-1.79h9.561c.936 0 1.697.803 1.697 1.79s-.762 1.79-1.697 1.79zm-9.561-2.58c-.385 0-.697.354-.697.79s.312.79.697.79h9.561c.385 0 .697-.354.697-.79s-.312-.79-.697-.79h-9.561z" />
                      <path d="M11.618 24c-1.604 0-2.977-.533-3.97-1.541L3.55 18.278C2.551 17.262 2 15.819 2 14.215c0-1.578.551-3.008 1.552-4.025L13.071.509c.66-.67 1.829-.652 2.506.036.694.706.71 1.839.034 2.524l-1.762 1.816a5.25 5.25 0 0 1 1.739 1.159l2.463 2.53c.672.684.655 1.815-.039 2.521a1.79 1.79 0 0 1-1.284.545c-.464 0-.896-.181-1.219-.509l-2.536-2.492c-.321-.327-.779-.49-1.367-.49-.606 0-1.069.157-1.375.469l-4.067 4.194c-.342.349-.521.831-.521 1.4 0 .577.189 1.101.519 1.436l4.083 4.182c.315.321.774.484 1.362.484s1.045-.163 1.36-.484l2.549-2.505a1.687 1.687 0 0 1 1.209-.503h.002c.483 0 .939.194 1.286.546.693.705.71 1.837.036 2.522l-2.457 2.525C14.586 23.438 13.176 24 11.618 24z" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className=" bg-gray-100 flex items-center justify-center p-4">
        {userData && userData?.time && <StudyGraph data={userData?.time} />}
      </div>
      <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Skills Section */}
        <motion.div
          className="flex-1 p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="space-y-8">
            {userData.skills && userData.skills.length > 0 ? (
              <SkillCard skills={userData.skills} />
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center justify-center px-6 py-3 text-white bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          >
            Add Skill
          </button>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
              <motion.div
                className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
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
                  className="w-full p-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="space-y-2 overflow-y-scroll max-h-64">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="block w-full text-left p-2 rounded bg-blue-100 hover:bg-blue-200 transition duration-200"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Heatmap Section */}
        <motion.div
          className="flex-1 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Heatmaps</h2>
          <span className="inline-flex items-center text-xl font-semibold mb-2">
  LeetCode
  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 fill-black"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.303 16.047h-9.561c-.936 0-1.697-.803-1.697-1.79s.762-1.79 1.697-1.79h9.561c.936 0 1.697.803 1.697 1.79s-.762 1.79-1.697 1.79zm-9.561-2.58c-.385 0-.697.354-.697.79s.312.79.697.79h9.561c.385 0 .697-.354.697-.79s-.312-.79-.697-.79h-9.561z" />
                      <path d="M11.618 24c-1.604 0-2.977-.533-3.97-1.541L3.55 18.278C2.551 17.262 2 15.819 2 14.215c0-1.578.551-3.008 1.552-4.025L13.071.509c.66-.67 1.829-.652 2.506.036.694.706.71 1.839.034 2.524l-1.762 1.816a5.25 5.25 0 0 1 1.739 1.159l2.463 2.53c.672.684.655 1.815-.039 2.521a1.79 1.79 0 0 1-1.284.545c-.464 0-.896-.181-1.219-.509l-2.536-2.492c-.321-.327-.779-.49-1.367-.49-.606 0-1.069.157-1.375.469l-4.067 4.194c-.342.349-.521.831-.521 1.4 0 .577.189 1.101.519 1.436l4.083 4.182c.315.321.774.484 1.362.484s1.045-.163 1.36-.484l2.549-2.505a1.687 1.687 0 0 1 1.209-.503h.002c.483 0 .939.194 1.286.546.693.705.71 1.837.036 2.522l-2.457 2.525C14.586 23.438 13.176 24 11.618 24z" />
                    </svg>
</span>

          <img
            src={`https://leetcard.jacoblin.cool/${userData?.LeetCodeProfileName}?ext=heatmap`}
            alt={`${userData?.LeetCodeProfileName}'s LeetCode Card`}
            className="rounded-lg shadow-lg max-w-full object-cover mb-4 hover:scale-105 transition-transform duration-300"
          />
          <span className="inline-flex items-center text-xl font-semibold mb-2">GitHub <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 fill-black"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.5 23.862a.5.5 0 0 1-.5-.5v-3.72c0-.899-.115-1.537-.363-2.005a.5.5 0 0 1 .329-.72C16.93 16.233 19 14.064 19 11.642c0-1.2-.493-2.345-1.425-3.312a.5.5 0 0 1-.094-.558c.372-.802.293-1.894-.148-2.549-.583.228-1.34.705-1.832 1.289a.496.496 0 0 1-.554.147 8.67 8.67 0 0 0-5.893 0 .5.5 0 0 1-.554-.146c-.492-.584-1.249-1.061-1.833-1.289-.441.655-.52 1.747-.148 2.549a.498.498 0 0 1-.094.557C5.493 9.297 5 10.443 5 11.642c0 2.307 1.863 4.385 4.636 5.17a.501.501 0 0 1 .364.482v.349c0 .626-.251.979-.462 1.166-.452.397-1.036.337-1.1.33h-.01c-.824 0-1.444-.459-2.043-.903-.301-.223-.606-.45-.961-.638.077.104.153.211.23.318.75 1.043 1.599 2.226 2.847 2.226h1a.5.5 0 0 1 .5.5v2.72a.5.5 0 0 1-.608.488C3.95 22.642 0 17.719 0 12.142c0-6.617 5.383-12 12-12s12 5.383 12 12c0 5.576-3.95 10.5-9.392 11.708a.497.497 0 0 1-.108.012z" />
                    </svg></span>
          {userData?.GitHubProfileName && (
            <GitHubHeatmap username={userData?.GitHubProfileName} />
          )}
        </motion.div>
      </div>
    </div>


      {/* <Timers/> */}
    </div>
  );
}

export default EditableProfile;
