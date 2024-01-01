import React, { useState, useEffect } from "react"; 

function VideoEmbed({ videoUrl, onVideoLoad, onConfirmVideo }) {
    const [videoAdded, setVideoAdded] = useState(!!videoUrl);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoConfirmed, setVideoConfirmed] = useState(false);

    useEffect(() => {
        if (videoAdded) {
            onVideoLoad(); // Notify the parent component when the video is loaded
        }
    }, [videoAdded, onVideoLoad]);

    const handleConfirmVideo = () => {
        setVideoConfirmed(true);
        onConfirmVideo(); // Notify the parent component when the video is confirmed
    };

    if (!videoAdded) {
        return (
            <div>
                <p>No video URL provided</p>
            </div>
        );
    }

    return (
        <div>
            {/* Instagram */}
            {videoUrl.includes("instagram.com") && (
                <iframe
                    src={videoUrl + "/embed"}
                    width="500"
                    height="400"
                    title="Instagram Video"
                    allowFullScreen
                ></iframe>
            )}

            {/* YouTube */}
            {videoUrl.includes("youtube.com") && (
                <iframe
                    src={videoUrl.replace("watch?v=", "embed/")}
                    width="500"
                    height="400"
                    title="YouTube Video"
                    allowFullScreen
                ></iframe>
            )}

            {/* TikTok */}
            {videoUrl.includes("tiktok.com") && (
                <iframe
                    src={videoUrl.replace("tiktok.com", "tiktok.com/embed")}
                    width="500"
                    height="400"
                    title="TikTok Video"
                    allowFullScreen
                ></iframe>
            )}

            {videoLoaded && (
                <div>
                    <p>Video Preview: {videoUrl}</p>
                    {!videoConfirmed && (
                        <button onClick={handleConfirmVideo}>Confirm Video</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoEmbed;
