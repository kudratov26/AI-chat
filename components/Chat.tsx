"use client";

import React, { useEffect, useState } from 'react'
import { VideoPlayer } from './VideoPlayer'
import { useConversation } from '@/hook/use-converstation'
import { Button } from './Button'
import { Status } from './Status'
import { Transcript } from './Transcript'
import { useSpeechRecognition } from '@/hook/use-speech-recognition';
import { LOOPING_VIDEOS } from '@/constants/videos';

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

    const [transcript, setTranscript] = useState('')

    const handleStartChat = () => {
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
            setTranscript(interimTranscript)
            startSilenceTimer(7000)
        }
    }, [interimTranscript, state, startSilenceTimer])

    return (
        <div className='max-w-4xl mx-auto space-y-6'>
            {/* Video Player - Centered */}
            <div className='flex justify-center'>
                <VideoPlayer
                    currentVideo={currentVideo}
                    currentSource={currentSource}
                    isMuted={isMuted}
                    isLooping={LOOPING_VIDEOS.has(currentVideo)}
                    onVideoEnded={onVideoEnded}
                />
            </div>

            {/* Status Display */}
            <div className="flex items-center justify-center space-x-4">
                {isListening && (
                    <Status status="Listening..." type="listening" />
                )}
                {state && (
                    <div className="text-sm text-gray-600 capitalize">
                        State: {state}
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
                {state === 'idle' && (
                    <Button
                        onClick={() => {
                            setIsMuted(false)
                            startChat()
                        }}
                        disabled={!isSupported}
                    >
                        Start Chat
                    </Button>
                )}

                {(state === 'listening' || state === 'responding') && (
                    <Button onClick={() => {
                        setIsMuted(true)
                        endChat()
                    }} variant="outline"
                    >
                        End Chat
                    </Button>
                )}

                {state !== 'idle' && (
                    <Button onClick={resetChat} variant="secondary">
                        Reset
                    </Button>
                )}
            </div>

            {/* Speech Support Warning */}
            {!isSupported && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                    <p className="text-sm">
                        Speech recognition is not supported in your browser. Please use Chrome or Edge for best experience.
                    </p>
                </div>
            )}

            {/* Current Transcript */}
            {transcript && (
                <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">You said:</span> {transcript}
                    </p>
                </div>
            )}

            {/* Full Transcript Below Video */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Transcript
                    transcriptHistory={transcriptHistory}
                    isListening={isListening}
                />
            </div>
        </div>
    )
}
