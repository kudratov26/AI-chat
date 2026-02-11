"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
    currentVideo: string;
    currentSource: string;
    isMuted: boolean;
    isLooping: boolean;
    onVideoEnded: (videoKey: string) => void;
}

export function VideoPlayer({
    currentVideo,
    currentSource,
    isMuted,
    onVideoEnded,
    isLooping
}: VideoPlayerProps) {
    const activeRef = useRef<HTMLVideoElement>(null);
    const bufferRef = useRef<HTMLVideoElement>(null);
    const [activeSource, setActiveSource] = useState(currentSource);
    const [bufferSource, setBufferSource] = useState<string | null>(null);
    const [isActiveVisible, setIsActiveVisible] = useState(true);
    const prevSourceRef = useRef<string>(currentSource);

    useEffect(() => {
        if (currentSource === prevSourceRef.current) return;
        prevSourceRef.current = currentSource;

        const targetRef = isActiveVisible ? bufferRef : activeRef;

        if (targetRef.current) {
            // Pre-load in the hidden element
            targetRef.current.src = currentSource;
            targetRef.current.load();

            const handleCanPlay = () => {
                targetRef.current?.removeEventListener("canplay", handleCanPlay);
                // Swap visibility
                if (isActiveVisible) {
                    setBufferSource(currentSource);
                } else {
                    setActiveSource(currentSource);
                }

                targetRef.current
                    ?.play()
                    .then(() => {
                        setIsActiveVisible(!isActiveVisible);
                        // Pause the now-hidden video
                        const hiddenRef = isActiveVisible ? activeRef : bufferRef;
                        if (hiddenRef.current) {
                            hiddenRef.current.pause();
                        }
                    })
                    .catch(() => {
                        // Autoplay may be blocked, still swap
                        setIsActiveVisible(!isActiveVisible);
                    });
            };

            targetRef.current.addEventListener("canplay", handleCanPlay);
        }
    }, [currentSource, isActiveVisible]);

    const handleEnded = (videoKey: string) => {
        onVideoEnded(videoKey);
    };

    return (
        <div className="relative w-full aspect-video max-h-[70vh] overflow-hidden rounded-xl bg-secondary">
            {/* Active video */}
            <video
                ref={activeRef}
                src={activeSource}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isActiveVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                loop={isLooping && isActiveVisible}
                muted={isMuted}
                autoPlay
                playsInline
                preload="auto"
                onEnded={() => {
                    if (isActiveVisible) handleEnded(currentVideo);
                }}
            />

            {/* Buffer video (hidden, preloading) */}
            <video
                ref={bufferRef}
                src={bufferSource ?? undefined}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${!isActiveVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                loop={isLooping && !isActiveVisible}
                muted={isMuted}
                playsInline
                preload="auto"
                onEnded={() => {
                    if (!isActiveVisible) handleEnded(currentVideo);
                }}
            />
        </div>
    );
}
