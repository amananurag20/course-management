import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  MdPlayCircle,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
  MdSettings,
  MdVolumeDown,
} from "react-icons/md";
import YouTube from 'react-youtube';

const VideoPlayer = forwardRef(({ videoId, onTimeUpdate }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);
  const progressInterval = useRef(null);
  const playerContainerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const volumeControlRef = useRef(null);
  const settingsRef = useRef(null);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  // Handle click outside for settings and volume
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (
        volumeControlRef.current &&
        !volumeControlRef.current.contains(event.target)
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle space bar and click for play/pause
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.code === "Space" &&
        document.activeElement.tagName !== "BUTTON" &&
        document.activeElement.tagName !== "INPUT"
      ) {
        e.preventDefault();
        handlePlay();
      }
    };

    const handleVideoClick = (e) => {
      // Only handle clicks on the video container, not the controls
      if (
        e.target === playerWrapperRef.current ||
        e.target === playerContainerRef.current
      ) {
        handlePlay();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    playerWrapperRef.current?.addEventListener("click", handleVideoClick);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      playerWrapperRef.current?.removeEventListener("click", handleVideoClick);
    };
  }, [player, isPlaying]);

  // Prevent right click on the entire player
  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    container.addEventListener("contextmenu", handleContextMenu);
    const iframe = container.querySelector("iframe");
    if (iframe) {
      iframe.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      container.removeEventListener("contextmenu", handleContextMenu);
      if (iframe) {
        iframe.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, [player]);

  // Function to handle time updates
  const handleTimeUpdate = (currentTime) => {
    if (onTimeUpdate && !isNaN(currentTime)) {
      setProgress((currentTime / duration) * 100);
      onTimeUpdate(currentTime);
    }
  };

  useEffect(() => {
    let youtubeScript;
    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT) {
          resolve(window.YT);
          return;
        }

        youtubeScript = document.createElement("script");
        youtubeScript.src = "https://www.youtube.com/iframe_api";
        youtubeScript.async = true;
        document.body.appendChild(youtubeScript);

        window.onYouTubeIframeAPIReady = () => {
          resolve(window.YT);
        };
      });
    };

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();

        if (!playerContainerRef.current) return;

        // Destroy existing player if it exists
        if (player) {
          player.destroy();
        }

        // Create new player
        const YT = window.YT;
        new YT.Player(playerContainerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            widget_referrer: window.location.origin,
            disablekb: 1,
            iv_load_policy: 3,
            cc_load_policy: 0,
            start: 0,
          },
          events: {
            onReady: (event) => {
              setIsLoading(false);
              setDuration(event.target.getDuration());
              setPlayer(event.target);
              if (ref) {
                ref.current = event.target;
              }
              // Set initial volume
              event.target.setVolume(volume);
              // Add CSS to hide YouTube logo and right-click menu
              const iframe = event.target.getIframe();
              if (iframe) {
                iframe.style.pointerEvents = "none";
              }
              handleTimeUpdate(0);
            },
            onStateChange: (event) => {
              const playerState = event.data;
              setIsPlaying(playerState === YT.PlayerState.PLAYING);

              // Handle different player states
              switch (playerState) {
                case YT.PlayerState.ENDED:
                  setIsPlaying(false);
                  setProgress(100);
                  handleTimeUpdate(duration);
                  break;
                case YT.PlayerState.PLAYING:
                  // Start time updates
                  if (progressInterval.current) {
                    clearInterval(progressInterval.current);
                  }
                  progressInterval.current = setInterval(() => {
                    const currentTime = event.target.getCurrentTime();
                    handleTimeUpdate(currentTime);
                  }, 500);
                  break;
                case YT.PlayerState.PAUSED:
                  // Clear interval when paused
                  if (progressInterval.current) {
                    clearInterval(progressInterval.current);
                  }
                  // Update time one last time to ensure accuracy
                  handleTimeUpdate(event.target.getCurrentTime());
                  break;
              }
            },
            onError: (error) => {
              console.error("YouTube Player Error:", error);
              setIsLoading(false);
            },
          },
        });
      } catch (error) {
        console.error("Error initializing YouTube player:", error);
        setIsLoading(false);
      }
    };

    initializePlayer();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (player) {
        player.destroy();
      }
      if (youtubeScript) {
        document.body.removeChild(youtubeScript);
      }
    };
  }, [videoId]);

  // Clear interval when component unmounts or video changes
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [videoId]);

  const handlePlay = () => {
    if (player) {
      try {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch (error) {
        console.error("Error toggling play state:", error);
      }
    }
  };

  const handleMute = () => {
    if (player) {
      try {
        if (isMuted) {
          player.unMute();
          player.setVolume(volume);
        } else {
          player.mute();
        }
        setIsMuted(!isMuted);
      } catch (error) {
        console.error("Error toggling mute state:", error);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    if (player) {
      try {
        player.setVolume(newVolume);
        setVolume(newVolume);
        if (newVolume === 0) {
          player.mute();
          setIsMuted(true);
        } else if (isMuted) {
          player.unMute();
          setIsMuted(false);
        }
      } catch (error) {
        console.error("Error changing volume:", error);
      }
    }
  };

  const handleFullscreen = () => {
    if (playerWrapperRef.current) {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          playerWrapperRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error("Error toggling fullscreen:", error);
      }
    }
  };

  const handleProgressClick = (e) => {
    if (player && progressRef.current) {
      try {
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        player.seekTo(newTime, true);
        setProgress(pos * 100);
      } catch (error) {
        console.error("Error seeking video:", error);
      }
    }
  };

  const handlePlaybackSpeed = (speed) => {
    if (player) {
      try {
        player.setPlaybackRate(speed);
      } catch (error) {
        console.error("Error setting playback speed:", error);
      }
    }
  };

  const handleQualityChange = (quality) => {
    if (player) {
      try {
        player.setPlaybackQuality(quality);
      } catch (error) {
        console.error("Error setting video quality:", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <MdVolumeOff size={24} />;
    if (volume < 50) return <MdVolumeDown size={24} />;
    return <MdVolumeUp size={24} />;
  };

  return (
    <div
      ref={playerWrapperRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden cursor-pointer"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      <div ref={playerContainerRef} className="w-full h-full" />

      {/* Custom Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer group relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-purple-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {/* Hover preview time */}
          <div className="absolute h-1 top-0 left-0 right-0 group-hover:h-1.5 transition-all duration-200"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlay}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isPlaying ? <MdPause size={24} /> : <MdPlayCircle size={24} />}
            </button>

            {/* Volume Control */}
            <div ref={volumeControlRef} className="relative">
              <button
                onClick={handleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {getVolumeIcon()}
              </button>

              {/* Volume Slider */}
              {showVolumeSlider && (
                <div className="absolute left-0 bottom-full mb-2 bg-gray-800 p-2 rounded-lg">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${volume}%, #4B5563 ${volume}%, #4B5563 100%)`,
                    }}
                  />
                </div>
              )}
            </div>

            <span className="text-white text-sm">
              {player &&
                `${formatTime(player.getCurrentTime() || 0)} / ${formatTime(
                  duration
                )}`}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings Button */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-purple-400 transition-colors"
              >
                <MdSettings size={24} />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px]">
                  {/* Playback Speed */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-400 mb-1">Playback Speed</p>
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          handlePlaybackSpeed(speed);
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-700 rounded"
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Quality */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Quality</p>
                    {["auto", "hd1080", "hd720", "large"].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => {
                          handleQualityChange(quality);
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-white hover:bg-gray-700 rounded"
                      >
                        {quality === "hd1080"
                          ? "1080p"
                          : quality === "hd720"
                          ? "720p"
                          : quality === "large"
                          ? "480p"
                          : "Auto"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <MdFullscreen size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
