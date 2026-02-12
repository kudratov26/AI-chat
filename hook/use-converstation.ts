import { useState, useEffect, useRef, useCallback } from "react";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export type ConversationState =
    | "idle"
    | "greeting"
    | "listening"
    | "responding"
    | "goodbye"
    | "fallback"
    | "prompt";

export type VideoKey =
    | "idle"
    | "greeting"
    | "listening"
    | "weather"
    | "general_response"
    | "goodbye"
    | "fallback"
    | "prompt"
    | "easter_egg";

export const VIDEO_SOURCES: Record<VideoKey, string[]> = {
    idle: ["/videos/idle.mp4"],
    greeting: ["/videos/greeting.mp4"],
    listening: ["/videos/listening.mp4"],
    weather: ["/videos/weather.mp4"],
    general_response: ["/videos/general_response.mp4"],
    goodbye: ["/videos/goodbye.mp4"],
    fallback: ["/videos/fallback.mp4"],
    prompt: ["/videos/prompt.mp4"],
    easter_egg: ["/videos/easter_egg.mp4"],
};

export const LOOPING_VIDEOS: Set<VideoKey> = new Set([
    "idle",
    "listening",
]);

interface KeywordMap {
    keywords: string[];
    video: VideoKey;
}

const KEYWORD_MAPPINGS: KeywordMap[] = [
    { keywords: ["weather", "today", "forecast", "temperature"], video: "weather" },
    { keywords: ["goodbye", "bye", "see you", "quit", "exit", "end"], video: "goodbye" },
    { keywords: ["hello", "hi", "hey", "greetings"], video: "general_response" },
    // { keywords: ["secret", "magic", "code", "hidden"], video: "easter_egg" },
];

const AI_RESPONSES: Partial<Record<VideoKey, string>> = {
    greeting: "Hello! I'm ready to chat with you.",
    weather: "The weather today seems quite pleasant, doesn't it?",
    general_response: "That's interesting! How can I help you today?",
    goodbye: "It was nice talking to you. Goodbye!",
    fallback: "I'm sorry, I didn't quite catch that. Could you repeat?",
    prompt: "Are you still there? I'm listening.",
};

function matchKeyword(transcript: string[]) {
    const keywords = transcript.map((word) => word.toLowerCase().trim());

    // Debug logging
    console.log('Matching keywords:', keywords);

    for (const keyword of keywords) {
        for (const mapping of KEYWORD_MAPPINGS) {
            if (mapping.keywords.includes(keyword)) {
                console.log('Matched:', keyword, '->', mapping.video);
                return mapping.video;
            }
        }
    }

    console.log('No match found, using general_response');
    return "general_response";
}

export function useConversation() {
    const [state, setState] = useState<ConversationState>('idle')
    const [currentVideo, setCurrentVideo] = useState<VideoKey>('idle')
    const [currentSource, setCurrentSource] = useState<string>(VIDEO_SOURCES['idle'][0])
    const [transcriptHistory, setTranscriptHistory] = useState<
        Array<{ text: string; type: "user" | "system" }>
    >([]);
    const [error, setError] = useState<string | null>(null)

    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleSpeechResult = useCallback((transcript: string) => {
        const words = transcript.toLowerCase().split(' ')
        const matchedVideo = matchKeyword(words)

        // Add to transcript history
        setTranscriptHistory(prev => [...prev, { text: transcript, type: "user" }])
        playVideo(matchedVideo)
    }, [])

    const handleSpeechError = useCallback(() => {
        setError('Speech recognition error occurred')
        if (state === 'listening') {
            playVideo('fallback')
        }
    }, [state])

    const startSilenceTimer = useCallback((duration: number) => {
        clearSilenceTimer()
        silenceTimeoutRef.current = setTimeout(() => {
            if (state === 'listening') {
                playVideo('prompt')
                setTimeout(() => {
                    playVideo('listening')
                }, 3000)
            }
        }, duration)
    }, [state])

    const clearSilenceTimer = useCallback(() => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }
    }, [])

    const playVideo = useCallback((videoKey: VideoKey) => {
        setCurrentVideo(videoKey)
        setCurrentSource(VIDEO_SOURCES[videoKey][0])

        const responseText = AI_RESPONSES[videoKey];
        if (responseText) {
            setTranscriptHistory(prev => [...prev, { text: responseText, type: "system" }]);
        }

        // Update conversation state based on video
        if (videoKey === 'idle') {
            setState('idle')
        } else if (videoKey === 'greeting') {
            setState('greeting')
        } else if (videoKey === 'listening') {
            setState('listening')
        } else if (videoKey === 'goodbye') {
            setState('goodbye')
        } else if (videoKey === 'fallback' || videoKey === 'prompt') {
            setState(videoKey)
        } else {
            setState('responding')
        }
    }, [])

    const startChat = useCallback(() => {
        playVideo('greeting')
    }, [playVideo])

    const endChat = useCallback(() => {
        playVideo('goodbye')
    }, [playVideo])

    const resetChat = useCallback(() => {
        setState('idle')
        setCurrentVideo('idle')
        setCurrentSource(VIDEO_SOURCES['idle'][0])
        setTranscriptHistory([])
        setError(null)
        clearSilenceTimer()
    }, [clearSilenceTimer])

    // Handle video end events
    const handleVideoEnd = useCallback(() => {
        if (state === 'greeting') {
            playVideo('listening')
        } else if (state === 'responding') {
            playVideo('listening')
        } else if (state === 'goodbye') {
            resetChat()
        } else if (state === 'fallback' || state === 'prompt') {
            playVideo('listening')
        }
    }, [state, playVideo, resetChat])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearSilenceTimer()
        }
    }, [clearSilenceTimer])

    return {
        state,
        currentVideo,
        currentSource,
        transcriptHistory,
        error,
        startChat,
        endChat,
        resetChat,
        onVideoEnded: handleVideoEnd,
        handleSpeechResult,
        handleSpeechError,
        startSilenceTimer,
        clearSilenceTimer,
        VIDEO_SOURCES,
        LOOPING_VIDEOS
    }
}