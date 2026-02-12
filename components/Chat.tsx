"use client";

import React, { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { useConversation } from '@/hook/use-converstation'
import { Button } from './Button'
import { Status } from './Status'
import { Transcript } from './Transcript'
import { AudioVisualizer } from './AudioVisualizer'
import { useSpeechRecognition } from '@/hook/use-speech-recognition';
import { LOOPING_VIDEOS } from '@/constants/videos';
import { resumeContext } from '@/lib/audio-context';

export const Chat = () => {
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

    const [isMuted, setIsMuted] = useState(true)

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

    const handleStartChat = async () => {
        await resumeContext();
        setIsMuted(false)
        startChat()
    }

    useEffect(() => {
        if (state === 'listening') {
            startListening()
            startSilenceTimer(7000)
        } else {
            stopListening()
            clearSilenceTimer()
        }
    }, [state, startListening, stopListening, startSilenceTimer, clearSilenceTimer])

    useEffect(() => {
        if (interimTranscript && state === 'listening') {
            startSilenceTimer(7000)
        }
    }, [interimTranscript, state, startSilenceTimer])

    // Active means AI is speaking/acting
    const isAIActive = state !== 'idle' && state !== 'listening' && state !== 'prompt';

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

                {/* Minimalistic Audio Visualizer Overlay */}
                <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
                    <AudioVisualizer
                        isActive={isAIActive}
                        isListening={isListening}
                    />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="text-red-500/80 text-[11px] font-mono text-center animate-in fade-in slide-in-from-top-1">
                    [ERROR: {error.toUpperCase()}]
                </div>
            )}

            {/* Clean Transcript Area */}
            <div className="px-4 py-2">
                <Transcript
                    transcriptHistory={transcriptHistory}
                    isListening={isListening}
                    interimTranscript={interimTranscript}
                />
            </div>

            {/* Control Buttons - Minimalist */}
            <div className="flex justify-center space-x-8 pt-2">
                {state === 'idle' ? (
                    <button
                        onClick={handleStartChat}
                        disabled={!isSupported}
                        className="text-gray-400 hover:text-gray-600 text-xs font-mono uppercase tracking-widest transition-colors duration-300 disabled:opacity-30"
                    >
                        [ Start ]
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setIsMuted(true)
                                endChat()
                            }}
                            className="text-gray-400 hover:text-red-400 text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                        >
                            [ End ]
                        </button>
                        <button
                            onClick={resetChat}
                            className="text-gray-300 hover:text-gray-500 text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                        >
                            [ Reset ]
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
