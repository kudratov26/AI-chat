"use client";

import { useEffect, useState, useRef } from "react";

export function useMediaRecorder() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startMicrophone = async () => {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = audioStream;
                setStream(audioStream);

                const recorder = new MediaRecorder(audioStream);
                setMediaRecorder(recorder);

                // We don't necessarily need to start the recorder for the canvas visualizer
                // if we use the stream directly with an AnalyserNode.
                // But we'll keep it for compatibility if needed elsewhere.
                recorder.start(10);
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        };

        startMicrophone();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return { mediaRecorder, stream };
}
