import { VideoKey } from "@/types/types";

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