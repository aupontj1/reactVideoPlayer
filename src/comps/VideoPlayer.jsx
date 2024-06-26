import { useState, useRef, useEffect } from "react";
import { 
    FaPlay, 
    FaPause, 
    FaStop, 
    FaExpand, 
    FaCompress, 
    FaVolumeUp,
    FaVolumeMute, 
} from "react-icons/fa";


const VideoPlayer = ({src, thumbnail}) => {
    const videoRef = useRef(null);
    const intervalRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [useNativeControls, setUseNativeControls] = useState(window.innerWidth < 767,);

    // Logic for the videoplayer resize functionality
    useEffect (() => {
       const handleResize = () => {
        setUseNativeControls(window.innerWidth < 767);
       }; 

       window.addEventListener('resize', handleResize);
       
       //Cleanup Listener on unmount
       return () => {
        window.removeEventListener('resize', handleResize);
       }    
    }, [])

    useEffect(() => {
        // Set up an event listener for when the video ends
        const video = videoRef.current;

        const handleVideoEnd = () => {
            setIsPlaying(false);
            setProgress(0);
            stopProgressLoop();
        };

        if(video){
            video.addEventListener('ended', handleVideoEnd);
        }

        // CleanUp Event Listener
        return () => {
            if(video){
                video.removeEventListener('ended', handleVideoEnd);
            }
            stopProgressLoop();
        };
    },[])


    // Shows how much video is left based on a percentage & a visual representation
    const updateProgress = () => {
        if(videoRef.current){
            const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(value);
        }
    }
    const startProgressLoop = () => {
        // Clear any existing intervals
        if(intervalRef.current){
            clearInterval(intervalRef.current);
        }

        // Set up an interval for updating the progress bar
        intervalRef.current = setInterval(() => {
            updateProgress();
        }, 1000); //Update every sec
    };

    const stopProgressLoop = () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const togglePlayPause = () => {
        if(videoRef.current){
            if(videoRef.current.paused){
                videoRef.current.play();
                setIsPlaying(true);
                startProgressLoop();
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                stopProgressLoop();
            }
        }
    };

    const stopVideo = () => {
        if(videoRef.current){
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSeek = (event) => {
        const seekTo = (event.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = seekTo;
        setProgress(event.target.value);
    }

    const toggleMute = () => {
        const currentVolume = videoRef.current.volume;
        if(currentVolume > 0){
            videoRef.current.volume = 0;
            setVolume(0);
            setIsMuted(true);
        } else {
            videoRef.current.volume = 1;
            setVolume(1);
            setIsMuted(false);
        }
    }

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    }

    const toggleFullScreen = () => {
        if(!isFullScreen){
            if(videoRef.current.requestFullScreen){
                videoRef.current.requestFullScreen();
            } else if (videoRef.current.mozRequestFullScreen) {
                // Firefox
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullScreen) {
                // Chrome, Safari, & Opera
                videoRef.current.webkitRequestFullScreen();
            } else if (videoRef.current.msRequestFullScreen){
                // IE/Edge 
                videoRef.current.msRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen){
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen){
                // Firefox 
                document.mozRequestFullScreen();
            } else if (document.webkitExitFullScreen) {
                // Chrome, Safari, & Opera
                document.webkitExitFullScreen();
            } else if (document.msExitFullScreen){
                // IE/Edge
                document.msExitFullScreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    // listen for fullscreen change events (for exiting function with ESC key)
    document.addEventListener('fullscreenchange', () => {
        setIsFullScreen(!!document.fullscreenElement);
    });

    // This effect cleans up the event listener when the component unmounts
    useEffect(() => {
        const handleFullScreenChange = () => 
            setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    const renderCustomContorls = () => {
        return (
            <>
                <button onClick={togglePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={stopVideo}>
                    <FaStop />
                </button>
                <input 
                type="range"
                min='0'
                max='100'
                value={progress}
                onChange={handleSeek}
                />
                <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp/>}
                </button>
                <input 
                type="range"
                min='0'
                max='1'
                step='0.05'
                value={volume}
                onChange={handleVolumeChange}
                />
                <button onClick={toggleFullScreen}>
                    {isFullScreen ? <FaCompress /> : <FaExpand />}
                </button>
            </>
        );
    };

    return (
        <>
        <video className="video-player" 
        ref={videoRef}
        src={src}
        poster={thumbnail}
        onClick={togglePlayPause}
        onPlay={startProgressLoop}
        onPause={stopProgressLoop}
        controls={useNativeControls} //use native controls based on viewport width
        />
        {!useNativeControls && renderCustomContorls()}
        </>
    )
} 

export default VideoPlayer;