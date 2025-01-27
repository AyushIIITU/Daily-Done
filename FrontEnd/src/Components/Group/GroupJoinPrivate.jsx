import { useRef, useState } from 'react';
import { API } from '../../Utils/API';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const user = JSON.parse(localStorage.getItem("user"));
const id = user?.id;

function GroupJoinPrivate() {
    const { groupId } = useParams();
    const refPassword = useRef(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnPrivateJoin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API}/api/group/join`,
                {
                    groupId: groupId,
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
                toast.success("Successfully joined the group!");
                navigate(`/group`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join group");
            console.error("Error in group", err);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-violet-500/10 p-3 rounded-full">
                        <Lock className="w-8 h-8 text-violet-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">
                    Join Private Group
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Enter the group password to join
                </p>

                {/* Form */}
                <form onSubmit={handleOnPrivateJoin} className="space-y-6">
                    <div className="relative">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter group password"
                                ref={refPassword}
                                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-violet-500 text-white pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
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
                            type="button"
                            onClick={() => navigate('/group')}
                            className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Additional Info */}
            <p className="mt-8 text-sm text-gray-400 text-center max-w-md">
                By joining this group, you agree to follow the group&apos;s rules and guidelines.
                Make sure you have the correct password from the group admin.
            </p>
        </div>
    );
}

export default GroupJoinPrivate;