"use client";

let audioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;

export const getAudioTools = () => {
    if (typeof window === "undefined") return { ctx: null, analyser: null };

    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        sharedAnalyser = audioContext.createAnalyser();
        sharedAnalyser.fftSize = 256;
        // Don't connect to destination yet; components will handle their input/output routing
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
