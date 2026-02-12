"use client";

import React, { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { ThemeToggle } from './ThemeToggle'
import { useConversation } from '@/hook/use-converstation'
import { Button } from './Button'
import { Status } from './Status'
import { Transcript } from './Transcript'
import { AudioVisualizer } from './AudioVisualizer'
import { useMediaRecorder } from '@/hook/use-media-recorder';
import { useSpeechRecognition } from '@/hook/use-speech-recognition';
import { LOOPING_VIDEOS } from '@/constants/videos';
import { resumeContext } from '@/lib/audio-context';

export const Chat = () => {
    // States
    const [isMuted, setIsMuted] = useState(true)

    // Hooks
    const { mediaRecorder, stream } = useMediaRecorder();
    const {
        state,
        currentVideo,
        currentSource,
        transcriptHistory,
        error,
        startChat,
        endChat,
        resetChat,
        onVideoEnded,
        handleSpeechResult,
        handleSpeechError,
        startSilenceTimer,
        clearSilenceTimer,
    } = useConversation();
    const {
        isListening,
        isSupported,
        interimTranscript,
        startListening,
        stopListening,
    } = useSpeechRecognition({
        onResult: handleSpeechResult,
        onError: handleSpeechError,
    });

    // Handlers
    const handleStartChat = () => {
        resumeContext();
        setIsMuted(false);
        startChat();
    }

    // Silence detector
    useEffect(() => {
        if (state === 'listening') {
            startListening()
            startSilenceTimer(7000)
        } else {
            stopListening()
            clearSilenceTimer()
        }
    }, [state, startListening, stopListening, startSilenceTimer, clearSilenceTimer])

    // listening
    useEffect(() => {
        if (interimTranscript && state === 'listening') {
            startSilenceTimer(7000)
        }
    }, [interimTranscript, state, startSilenceTimer])

    useEffect(() => {
        if (state === 'idle') {
            setTimeout(() => setIsMuted(true), 0)
        }
    }, [state])

    // AI is active if it's not idle and not explicitly 'just' listening
    // We want visualizer for greeting, responding, fallback, prompt
    const isAIActive = ['greeting', 'responding', 'fallback', 'prompt', 'goodbye'].includes(state || '');

    return (
        <div className='max-w-4xl mx-auto space-y-4'>
            <div className='relative'>
                <div className='flex justify-center'>
                    <VideoPlayer
                        currentVideo={currentVideo}
                        currentSource={currentSource}
                        isMuted={isMuted}
                        isLooping={LOOPING_VIDEOS.has(currentVideo)}
                        onVideoEnded={onVideoEnded}
                    />
                </div>
                <div className='absolute top-4 left-4 z-10'>
                    {state && state !== 'idle' && (
                        <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] bg-black/10 backdrop-blur-[2px] px-2 py-0.5 rounded-sm">
                            {state}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
                    <AudioVisualizer
                        stream={stream}
                        isVisible={isAIActive || isListening}
                    />
                </div>
            </div>
            {error && (
                <div className="text-red-500/80 text-[11px] font-mono text-center animate-in fade-in slide-in-from-top-1">
                    [ERROR: {error.toUpperCase()}]
                </div>
            )}
            <div className="px-4 py-2">
                <Transcript
                    transcriptHistory={transcriptHistory}
                    interimTranscript={interimTranscript}
                />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-8 pt-2">
                {state === 'idle' ? (
                    <button
                        className="text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-widest transition-colors duration-300 disabled:opacity-30"
                        onClick={handleStartChat}
                        disabled={!isSupported}
                    >
                        [ Start ]
                    </button>
                ) : (
                    <>
                        <button
                            className="text-muted-foreground hover:text-red-400 text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                            onClick={() => {
                                endChat()
                            }}
                        >
                            [ End ]
                        </button>
                        <button
                            className="text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                            onClick={resetChat}
                        >
                            [ Reset ]
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
