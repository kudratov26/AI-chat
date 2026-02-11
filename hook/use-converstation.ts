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
    const [transcript, setTranscript] = useState<string>('')
    const [currentVideo, setCurrentVideo] = useState<VideoKey>('idle')
    const [currentSource, setCurrentSource] = useState<string>(VIDEO_SOURCES['idle'][0])
    const [transcriptHistory, setTranscriptHistory] = useState<
        Array<{ text: string; type: "user" | "system" }>
    >([]);
    const [isListening, setIsListening] = useState(false)
    const [speechSupported, setSpeechSupported] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const recognitionRef = useRef<any>(null)
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechSupported(false)
            setError('Speech recognition is not supported in this browser')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
            clearSilenceTimeout()
        }

        recognition.onresult = (event: any) => {
            const current = event.resultIndex
            const transcript = event.results[current][0].transcript
            const isFinal = event.results[current].isFinal

            setTranscript(transcript)

            if (isFinal) {
                handleSpeechResult(transcript)
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setError(`Speech recognition error: ${event.error}`)
            setIsListening(false)

            // Play fallback video on error
            if (state === 'listening') {
                playVideo('fallback')
            }
        }

        recognition.onend = () => {
            setIsListening(false)
            clearSilenceTimeout()
        }

        recognitionRef.current = recognition

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            clearSilenceTimeout()
        }
    }, [state])

    const clearSilenceTimeout = () => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }
    }

    const startSilenceDetection = () => {
        clearSilenceTimeout()
        silenceTimeoutRef.current = setTimeout(() => {
            if (state === 'listening') {
                playVideo('prompt')
                // After prompt, resume listening
                setTimeout(() => {
                    startListening()
                }, 15000) // Changed from 10000 to 15000
            }
        }, 5000) // 5 seconds of silence as requested
    }

    const handleSpeechResult = useCallback((transcript: string) => {
        const words = transcript.toLowerCase().split(' ')
        const matchedVideo = matchKeyword(words)

        // Add to transcript history
        setTranscriptHistory(prev => [...prev, { text: transcript, type: "user" }])

        // Play the appropriate response video
        playVideo(matchedVideo)
    }, [])

    const startListening = useCallback(() => {
        if (!recognitionRef.current || !speechSupported) {
            return
        }

        try {
            recognitionRef.current.start()
            startSilenceDetection()
        } catch (error) {
            console.error('Failed to start speech recognition:', error)
            setError('Failed to start speech recognition')
        }
    }, [speechSupported])

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        clearSilenceTimeout()
    }, [])

    const playVideo = useCallback((videoKey: VideoKey) => {
        setCurrentVideo(videoKey)
        setCurrentSource(VIDEO_SOURCES[videoKey][0])

        // Update conversation state based on video
        if (videoKey === 'idle') {
            setState('idle')
        } else if (videoKey === 'greeting') {
            setState('greeting')
        } else if (videoKey === 'listening') {
            setState('listening')
            // Start listening when listening video begins
            setTimeout(() => {
                startListening()
            }, 500)
        } else if (videoKey === 'goodbye') {
            setState('goodbye')
            stopListening()
        } else if (videoKey === 'fallback' || videoKey === 'prompt') {
            setState(videoKey)
        } else {
            setState('responding')
        }
    }, [startListening, stopListening])

    const startChat = useCallback(() => {
        playVideo('greeting')
    }, [playVideo])

    const endChat = useCallback(() => {
        playVideo('goodbye')
    }, [playVideo])

    const resetChat = useCallback(() => {
        setState('idle')
        setTranscript('')
        setCurrentVideo('idle')
        setCurrentSource(VIDEO_SOURCES['idle'][0])
        setTranscriptHistory([])
        setError(null)
        stopListening()
    }, [stopListening])

    // Handle video end events
    const handleVideoEnd = useCallback(() => {
        if (state === 'greeting') {
            // After greeting, start listening
            playVideo('listening')
        } else if (state === 'responding') {
            // After response, go back to listening
            playVideo('listening')
        } else if (state === 'goodbye') {
            // After goodbye, return to idle
            resetChat()
        } else if (state === 'fallback' || state === 'prompt') {
            // After fallback/prompt, go back to listening
            playVideo('listening')
        }
        // Idle and listening videos loop automatically
    }, [state, playVideo, resetChat])

    return {
        state,
        transcript,
        currentVideo,
        currentSource,
        transcriptHistory,
        isListening,
        speechSupported,
        error,
        startChat,
        endChat,
        resetChat,
        startListening,
        stopListening,
        handleVideoEnd,
        VIDEO_SOURCES,
        LOOPING_VIDEOS
    }
}