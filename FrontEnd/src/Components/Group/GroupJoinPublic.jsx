import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../Utils/API';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, ArrowRight } from 'lucide-react';

const user = JSON.parse(localStorage.getItem("user"));

function GroupJoin() {
    const {groupId} = useParams();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleJoinPublic = async (groupId) => {
      setIsLoading(true);
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
          navigate(`/group`);
          setMessage("Successfully joined the group!");
          toast.success("Successfully joined the group!");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to join group");
        console.error("Error in group", err);
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-violet-500/10 p-3 rounded-full">
                        <Users className="w-8 h-8 text-violet-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">
                    Join Public Group
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    You&apos;re about to join a public study group
                </p>

                {/* Group ID Display */}
                <div className="bg-neutral-700/50 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-400 mb-2">Group ID</p>
                    <p className="text-white font-mono">{groupId}</p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 text-center">{message}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => handleJoinPublic(groupId)}
                        disabled={isLoading}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                Join Group
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => navigate('/group')}
                        className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-400 text-center max-w-md">
                <p className="mb-2">
                    By joining this group, you agree to follow the group&apos;s rules and guidelines.
                </p>
                <p>
                    You can leave the group at any time from the group settings.
                </p>
            </div>
        </div>
    );
}

export default GroupJoin;