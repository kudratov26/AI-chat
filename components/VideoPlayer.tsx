import { useEffect, useRef, useState } from "react";
import { getAudioTools } from "@/lib/audio-context";

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
    // States
    const [activeSource, setActiveSource] = useState(currentSource);
    const [bufferSource, setBufferSource] = useState<string | null>(null);
    const [isActiveVisible, setIsActiveVisible] = useState(true);

    // Refs
    const prevSourceRef = useRef<string>(currentSource);
    const activeRef = useRef<HTMLVideoElement>(null);
    const bufferRef = useRef<HTMLVideoElement>(null);
    // Audio connection refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Map<HTMLVideoElement, MediaElementAudioSourceNode>>(new Map());

    // Audio connection setup
    useEffect(() => {
        const { ctx, analyser } = getAudioTools();
        if (!ctx || !analyser) return;
        audioContextRef.current = ctx;

        const connectVideo = (video: HTMLVideoElement) => {
            if (!sourcesRef.current.has(video)) {
                try {
                    const source = ctx.createMediaElementSource(video);
                    source.connect(analyser);
                    sourcesRef.current.set(video, source);
                } catch (e) {
                    console.error("Failed to connect video to audio context:", e);
                }
            }
        };

        if (activeRef.current) connectVideo(activeRef.current);
        if (bufferRef.current) connectVideo(bufferRef.current);
    }, []);

    // Source change handler
    useEffect(() => {
        if (currentSource === prevSourceRef.current) return;
        prevSourceRef.current = currentSource;

        const targetRef = isActiveVisible ? bufferRef : activeRef;

        if (targetRef.current) {
            targetRef.current.src = currentSource;
            targetRef.current.load();

            const handleCanPlay = () => {
                targetRef.current?.removeEventListener("canplay", handleCanPlay);
                if (isActiveVisible) {
                    setBufferSource(currentSource);
                } else {
                    setActiveSource(currentSource);
                }

                targetRef.current
                    ?.play()
                    .then(() => {
                        setIsActiveVisible(!isActiveVisible);
                        const hiddenRef = isActiveVisible ? activeRef : bufferRef;
                        if (hiddenRef.current) {
                            hiddenRef.current.pause();
                        }
                    })
                    .catch(() => {
                        setIsActiveVisible(!isActiveVisible);
                    });
            };

            targetRef.current.addEventListener("canplay", handleCanPlay);
        }
    }, [currentSource, isActiveVisible]);

    // Ensure playback when unmuted/swapped
    useEffect(() => {
        const video = isActiveVisible ? activeRef.current : bufferRef.current;
        if (video && !isMuted) {
            video.play().catch(() => { });
        }
    }, [isMuted, isActiveVisible]);

    const handleEnded = (videoKey: string) => {
        onVideoEnded(videoKey);
    };

    return (
        <div className="relative w-full aspect-video max-h-[70vh] overflow-hidden rounded-xl bg-secondary">
            <video
                ref={activeRef}
                src={activeSource}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isActiveVisible ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                loop={isLooping && isActiveVisible}
                muted={isMuted}
                autoPlay
                playsInline
                preload="auto"
                onEnded={() => {
                    if (isActiveVisible) handleEnded(currentVideo);
                }}
            />

            <video
                ref={bufferRef}
                src={bufferSource ?? undefined}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${!isActiveVisible ? "opacity-100 z-10" : "opacity-0 z-0"}`}
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
