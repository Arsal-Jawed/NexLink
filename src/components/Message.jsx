import React, { useState, useRef, useEffect } from 'react';

const Message = ({ user, message, audio, classs }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const progressInterval = useRef(null);

    useEffect(() => {
        // Cleanup interval on unmount
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, []);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        // Update progress every 100ms
        progressInterval.current = setInterval(() => {
            if (audioRef.current) {
                const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(currentProgress || 0);
            }
        }, 100);
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    return (
        <div className={`message-container ${classs === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div className={`message-bubble ${classs} ${user ? 'bg-gray-200' : 'bg-gradient-to-r from-[#7b2cbf] to-[#e0aaff] text-white'}`}>
                {/* Show username only for received messages */}
                {user && classs === 'left' && (
                    <div className="username text-xs font-semibold mb-1">
                        {user}
                    </div>
                )}
                
                {/* Audio message */}
                {audio && (
                    <div className="audio-message flex items-center gap-2">
                        <button 
                            onClick={togglePlayPause}
                            className={`audio-control ${isPlaying ? 'pause' : 'play'}`}
                        >
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        
                        <div className="audio-progress-container flex-1">
                            <div 
                                className="audio-progress-bar" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        
                        <span className="audio-duration text-xs">
                            {audioRef.current ? formatTime(audioRef.current.duration) : '--:--'}
                        </span>
                        
                        <audio
                            ref={audioRef}
                            src={audio}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onEnded={handleEnded}
                            hidden
                        />
                    </div>
                )}
                
                {/* Text message */}
                {message && (
                    <div className="text-message">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper function to format time (seconds to MM:SS)
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default Message;