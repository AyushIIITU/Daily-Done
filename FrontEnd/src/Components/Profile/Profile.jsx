import { useState } from "react";
import GitHubHeatmap from "./GitHubHeatMap";

const SKILL = [
    "JavaScript",
    "React",
    "Node.js",
    "CSS",
    "HTML",
    "Python",
    "Django",
    "SQL",
    "MongoDB",
    "Git"
];

function Profile() {
    const [username, setUsername] = useState('ayush01122004'); 

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Profile</h2>
            
            {/* Skills Section */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {SKILL.map((skill, index) => (
                    <div
                        key={index}
                        className="bg-blue-100 border border-blue-300 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
                    >
                        {skill}
                    </div>
                ))}
            </div>

            {/* LeetCode Card Section */}
            <div className="flex flex-col items-center mb-6 overflow-hidden">
                <img
                    src={`https://leetcard.jacoblin.cool/${username}?ext=heatmap`}
                    alt={`${username}'s LeetCode Card`}
                    className="rounded-lg shadow-lg w-80 sm:w-96 mb-4"
                />
                <GitHubHeatmap username="AyushIIITU" />
            </div>
        </div>
    );
}

export default Profile;
