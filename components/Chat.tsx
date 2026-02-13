"use client";

import { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { useConversation } from '@/hook/use-converstation'
import { Transcript } from './Transcript'
import { AudioVisualizer } from './AudioVisualizer'
import { useMediaRecorder } from '@/hook/use-media-recorder';
import { useSpeechRecognition } from '@/hook/use-speech-recognition';
import { LOOPING_VIDEOS } from '@/constants/videos';
import { resumeContext } from '@/lib/audio-context';
import { motion, AnimatePresence } from 'framer-motion'

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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='max-w-4xl mx-auto space-y-4'
        >
            <div className='relative overflow-hidden rounded-2xl border border-border bg-black/5 dark:bg-black/20'>
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
                    <AnimatePresence mode="wait">
                        {state && state !== 'idle' && (
                            <motion.div
                                key={state}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-[10px] text-white/50 font-mono uppercase tracking-[0.2em] bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-sm border border-white/10"
                            >
                                {state}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
                    <AudioVisualizer
                        stream={stream}
                        isVisible={isAIActive || isListening}
                    />
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500/80 text-[11px] font-mono text-center overflow-hidden"
                    >
                        [ERROR: {error.toUpperCase()}]
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-2"
            >
                <Transcript
                    transcriptHistory={transcriptHistory}
                    interimTranscript={interimTranscript}
                />
            </motion.div>

            {/* Control Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center space-x-8 pt-2"
            >
                {state === 'idle' ? (
                    <button
                        className="text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-widest transition-colors duration-300 disabled:opacity-30 flex items-center gap-2 group"
                        onClick={handleStartChat}
                        disabled={!isSupported}
                    >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">»</span>
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
            </motion.div>
        </motion.div>
    )
}
