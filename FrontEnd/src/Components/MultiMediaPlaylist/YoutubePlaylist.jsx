import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { API } from "../../Utils/API";

const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || "").slice(0, -1);
  const minutes = (match[2] || "").slice(0, -1);
  const seconds = (match[3] || "").slice(0, -1);

  return [
    hours ? `${hours}:` : "",
    minutes ? (minutes.length === 1 ? `0${minutes}` : minutes) : "00",
    seconds ? (seconds.length === 1 ? `0${seconds}` : seconds) : "00",
  ].join("");
};

function YoutubePlaylist() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refLink = useRef("");
  const [playerStates, setPlayerStates] = useState({});

  // Extract Video ID from various YouTube URL formats
  const getVideoId = (url) => {
    const videoRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoRegex);
    return match && match[1] ? match[1] : null;
  };

  // Extract Playlist ID from YouTube URL
  const getPlaylistId = (url) => {
    const playlistRegex = /[?&]list=([^&#]*)/;
    const match = url.match(playlistRegex);
    return match && match[1] ? match[1] : null;
  };

  const addLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const Link = refLink.current.value;
      const playlistId = getPlaylistId(Link);
      if (playlistId) {
        const response = await axios.get(
          `${API}/api/yt/playlist/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        if (data.error) throw new Error(data.error.message);
        setVideos(
          data.items.map((item) => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
          }))
        );
      } else {
        const videoId = getVideoId(Link);
        if (videoId) {
          const response = await axios.get(`${API}/api/yt/video/${videoId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = response.data;
          if (!data) throw new Error("Video not found");

          setVideos([
            {
              videoId: data.videoId,
              title: data.title,
              thumbnail: data.thumbnail,
              duration: data.duration,
            },
          ]);
        } else {
          throw new Error("Invalid YouTube link");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const userVideos = async () => {
    try {
      const response = await axios.get(`${API}/api/yt/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setVideos(data);
      setPlayerStates(
        data.reduce((acc, video) => {
          acc[video.videoId] = { progress: video.progress };
          return acc;
        }, {})
      );
      console.log(data);
    } catch (error) {
      console.error("Failed to load user videos:", error);
      setError("Failed to load user videos");
    }
  };

  const onPlayerStateChange = async (event, videoId) => {
    if (
      event.data === window.YT.PlayerState.PAUSED ||
      event.data === window.YT.PlayerState.ENDED
    ) {
      const currentTime = event.target.getCurrentTime();
      try {
        await axios.patch(
          `${API}/api/yt/video/${videoId}`,
          { progress: currentTime },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update progress percentage for UI
        const duration = event.target.getDuration();
        const progress = (currentTime / duration) * 100;

        setPlayerStates((prev) => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            progress: progress,
          },
        }));
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  const onPlayerReady = async (event, videoId) => {
    try {
      const response = await axios.get(`${API}/api/yt/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const videos = response.data;
      const video = videos.find((v) => v.videoId === videoId);
      if (video && video.progress) {
        event.target.seekTo(video.progress);
      }

      // Initialize progress state for this video
      setPlayerStates((prev) => ({
        ...prev,
        [videoId]: {
          player: event.target,
          progress: 0,
        },
      }));

      // Update progress every second for this specific video
      const progressInterval = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        const duration = event.target.getDuration();
        const progress = (currentTime / duration) * 100;

        setPlayerStates((prev) => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            progress: progress,
          },
        }));
      }, 1000);

      // Store interval ID for cleanup
      setPlayerStates((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          intervalId: progressInterval,
        },
      }));
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(playerStates).forEach((state) => {
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
      });
    };
  }, [playerStates]);

  // Load the YouTube API when the component mounts
  useEffect(() => {
    userVideos();
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const handleDeleteVideo = async (videoId) => {
    try {
      await axios.delete(`${API}/api/yt/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update the userVideos state by filtering out the deleted video
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.videoId !== videoId)
      );
    } catch (error) {
      console.error("Failed to delete video:", error);
      setError("Failed to delete video");
    }
  };

  return (
    <div>
      <h1 className="text-center w-screen text-red-700 font-extrabold my-2 text-[5em]">
        YouTube Playlist & Video Library
      </h1>
      <form
        onSubmit={addLink}
        className="flex space-x-2 mb-4 flex-wrap gap-y-3 items-center justify-center"
      >
        <div className="relative w-auto">
          <input
            required
            type="text"
            placeholder="YouTube Link"
            className="p-4 outline-none bg-transparent max-w-[400px] w-full rounded-md text-black border border-gray-300 text-base"
            ref={refLink}
          />
          <span className="absolute rounded-xl left-0 text-xs transform translate-x-3 -translate-y-2 px-1 bg-gray-900 border border-gray-300 text-gray-300">
            Paste Here
          </span>
        </div>
        <button
          type="submit"
          className="relative inline-flex items-center justify-center w-30 h-10 px-3 border border-red-700 rounded text-white text-[13px] font-normal uppercase tracking-widest bg-red-600 shadow-[inset_0_30px_30px_-15px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_1px_20px_rgba(0,0,0,0),0_3px_0_#d32f2f,0_3px_2px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.1)] transition-all ease-in-out duration-150 active:translate-y-1 active:shadow-[inset_0_16px_2px_-15px_rgba(0,0,0,0),inset_0_0_0_1px_rgba(255,255,255,0.15),inset_0_1px_20px_rgba(0,0,0,0.1),0_0_0_#d32f2f,0_0_0_2px_rgba(255,255,255,0.5)] hover .text:hover:translate-x-20 hover .icon:hover:translate-x-6 hover .icon:hover:scale-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6 mr-2 transition-all ease-in-out duration-500"
          >
            <path
              d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"
              fill="#ffffff"
            ></path>
          </svg>
          <span className="text transition-all ease-in-out duration-500">
            YOUTUBE
          </span>
        </button>
      </form>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-8 container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Your Video Library</h2>
        <ul className="space-y-6">
          {videos.map((video) => (
            <li key={video.videoId} className="bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{video.title}</h3>
                  <button
                    onClick={() => handleDeleteVideo(video.videoId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    id={`player-${video.videoId}`}
                    src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                      new window.YT.Player(`player-${video.videoId}`, {
                        events: {
                          onReady: (event) => onPlayerReady(event, video.videoId),
                          onStateChange: (event) =>
                            onPlayerStateChange(event, video.videoId),
                        },
                      });
                    }}
                  ></iframe>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default YoutubePlaylist;
