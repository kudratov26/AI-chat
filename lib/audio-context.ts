"use client";

let audioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;

export const getAudioTools = () => {
    if (typeof window === "undefined") return { ctx: null, analyser: null };

    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        sharedAnalyser = audioContext.createAnalyser();
        sharedAnalyser.fftSize = 512; // Increased for better resolution

        // Trick to keep the analyser active without audible loopback:
        // Connect to a GainNode with 0 volume, then to destination.
        const silentGain = audioContext.createGain();
        silentGain.gain.value = 0;
        sharedAnalyser.connect(silentGain);
        silentGain.connect(audioContext.destination);
    }

    return { ctx: audioContext, analyser: sharedAnalyser };
};

// Resume context on user interaction if needed
export const resumeContext = async () => {
    const { ctx } = getAudioTools();
    if (ctx && ctx.state === "suspended") {
        await ctx.resume();
    }
};
