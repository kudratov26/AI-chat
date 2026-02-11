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
    const keywords = transcript.map((word) => word.toLowerCase());
    for (const keyword of keywords) {
        for (const mapping of KEYWORD_MAPPINGS) {
            if (mapping.keywords.includes(keyword)) {
                return mapping.video;
            }
        }
    }
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
}