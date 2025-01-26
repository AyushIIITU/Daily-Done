import React, { useEffect, useRef, useState } from 'react';



export function YoutubePlayer() {
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-player', {
        videoId: 'EHvqBaHv1BQ', // Example video ID
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            // Update progress every second
            setInterval(() => {
              if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                const progressPercent = (currentTime / duration) * 100;
                setProgress(progressPercent);
              }
            }, 1000);
          },
        },
      });
    };
  }, []);

  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="relative">
        <div id="youtube-player" className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"></div>
        
        <div className="absolute top-4 right-4 w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-200 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            {Math.round(100 - progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
