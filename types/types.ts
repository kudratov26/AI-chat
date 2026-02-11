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
