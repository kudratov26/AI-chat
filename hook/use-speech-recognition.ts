"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
    error: string;
    message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
    }
}

interface UseSpeechRecognitionOptions {
    onResult: (transcript: string) => void;
    onError: () => void;
    lang?: string;
}

export function useSpeechRecognition({
    onResult,
    onError,
    lang = "en-US",
}: UseSpeechRecognitionOptions) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const shouldRestartRef = useRef(false);
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    // Keep refs in sync
    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
    }, [onResult, onError]);

    // Check browser support
    useEffect(() => {
        const supported =
            typeof window !== "undefined" &&
            ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
        setIsSupported(supported);
    }, []);

    const stopListening = useCallback(() => {
        shouldRestartRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch {
                // ignore
            }
            recognitionRef.current = null;
        }
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) return;

        // Stop any existing instance
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch {
                // ignore
            }
            recognitionRef.current = null;
        }

        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
            setIsListening(true);
            shouldRestartRef.current = true;
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = "";
            let interim = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
            }

            if (finalTranscript.trim()) {
                setInterimTranscript("");
                shouldRestartRef.current = false;
                onResultRef.current(finalTranscript.trim());
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error === "no-speech" || event.error === "aborted") {
                return;
            }
            shouldRestartRef.current = false;
            setIsListening(false);
            setInterimTranscript("");
            onErrorRef.current();
        };

        recognition.onend = () => {
            if (shouldRestartRef.current) {
                try {
                    setTimeout(() => {
                        if (shouldRestartRef.current && recognitionRef.current) {
                            recognitionRef.current.start();
                        }
                    }, 100);
                } catch {
                    // ignore
                }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch {
            onErrorRef.current();
        }
    }, [isSupported, lang]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            shouldRestartRef.current = false;
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch {
                    // ignore
                }
            }
        };
    }, []);

    return {
        isListening,
        isSupported,
        interimTranscript,
        startListening,
        stopListening,
    };
}
