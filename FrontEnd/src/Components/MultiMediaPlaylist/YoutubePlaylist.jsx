import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { API } from "../../Utils/API";
const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').slice(0, -1);
    const minutes = (match[2] || '').slice(0, -1);
    const seconds = (match[3] || '').slice(0, -1);

    return [
        hours ? `${hours}:` : '',
        minutes ? (minutes.length === 1 ? `0${minutes}` : minutes) : '00',
        seconds ? (seconds.length === 1 ? `0${seconds}` : seconds) : '00'
    ].join('');
};
function YoutubePlaylist() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const refLink = useRef('');

    // Extract Video ID from various YouTube URL formats
    const getVideoId = (url) => {
        const videoRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/;
        const match = url.match(videoRegex);
        return (match && match[1]) ? match[1] : null;
    };

    // Extract Playlist ID from YouTube URL
    const getPlaylistId = (url) => {
        const playlistRegex = /[?&]list=([^&#]*)/;
        const match = url.match(playlistRegex);
        return (match && match[1]) ? match[1] : null;
    };

    const addLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const Link = refLink.current.value;
            const playlistId = getPlaylistId(Link);
            if (playlistId) {
                // const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`);
                // const data = await response.json();
                const response2=await axios(`${API}/api/yt/playlist/${playlistId}`);
                const data=await response2.data;
                // console.log(data2);
                if (data.error) throw new Error(data.error.message);
                console.log(data);

                setVideos(data.items.map(item => ({
                    videoId: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default.url,
                })));
            } else {
                const videoId = getVideoId(Link);
                if (videoId) {
                    // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
                    // const data = await response.json();
                    const response2=await axios(`${API}/api/yt/video/${videoId}`);
                    const data=await response2.data;
                    // console.log(data2);
                    if (data.error || data.items.length === 0) throw new Error('Video not found');
                    console.log(data);
                    
                    const video = data.items[0];
                    const duration = formatDuration(video.contentDetails.duration);
                    setVideos([{
                        videoId: video.id,
                        title: video.snippet.title,
                        thumbnail: video.snippet.thumbnails.default.url,
                        duration
                    }]);
                } else {
                    throw new Error('Invalid YouTube link');
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    const onPlayerStateChange = (event, videoId) => {
        // Save the timestamp when the video is paused or ended
        if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            const currentTime = event.target.getCurrentTime();
            localStorage.setItem(`yt-video-${videoId}`, currentTime);
        }
    };

    const onPlayerReady = (event, videoId) => {
        // Retrieve the saved timestamp and start from that point
        const savedTime = localStorage.getItem(`yt-video-${videoId}`);
        if (savedTime) {
            event.target.seekTo(parseFloat(savedTime));
        }
    };

    // Load the YouTube API when the component mounts
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    return (
        <div>
            <h1 className='text-center w-screen text-red-700 font-extrabold my-2 text-[5em]'>YouTube Playlist & Video Library</h1>
            <form onSubmit={addLink} className="flex space-x-2 mb-4 flex-wrap gap-y-3 items-center justify-center">
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
                <button type='submit' className="relative inline-flex items-center justify-center w-30 h-10 px-3 border border-red-700 rounded text-white text-[13px] font-normal uppercase tracking-widest bg-red-600 shadow-[inset_0_30px_30px_-15px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_1px_20px_rgba(0,0,0,0),0_3px_0_#d32f2f,0_3px_2px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.1)] transition-all ease-in-out duration-150 active:translate-y-1 active:shadow-[inset_0_16px_2px_-15px_rgba(0,0,0,0),inset_0_0_0_1px_rgba(255,255,255,0.15),inset_0_1px_20px_rgba(0,0,0,0.1),0_0_0_#d32f2f,0_0_0_2px_rgba(255,255,255,0.5)] hover .text:hover:translate-x-20 hover .icon:hover:translate-x-6 hover .icon:hover:scale-150">
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
  <span className="text transition-all ease-in-out duration-500">YOUTUBE</span>
</button>

                {/* <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800 flex items-center"
                >
                    <IoMdAdd />
                    <span className="ml-2">Fetch</span>
                </button> */}
            </form>

            {loading && <p>Loading videos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2 mx-auto">
                {videos.length > 0 ? videos.map((video) => (
                    <li key={video.videoId} className="flex items-center space-x-3">
                        <div className="aspect-w-full aspect-h-9">
                            <iframe
                                className='w-screen h-[50vh]'
                                id={`player-${video.videoId}`}
                                src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => {
                                    new window.YT.Player(`player-${video.videoId}`, {
                                        events: {
                                            'onReady': (event) => onPlayerReady(event, video.videoId),
                                            'onStateChange': (event) => onPlayerStateChange(event, video.videoId),
                                        },
                                    });
                                }}
                            ></iframe>
                            <span className="ml-2 text-gray-500">{video.duration}</span>
                        </div>
                    </li>
                )) : <p className='w-screen text-center font-bold font-mono'>No videos found. Paste a video or playlist link to see videos.</p>}
            </ul>
        </div>
    );
}

export default YoutubePlaylist;
