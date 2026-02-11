"use client";

import React from 'react'

interface TranscriptProps {
    transcriptHistory: Array<{ text: string; type: "user" | "system" }>
    isListening: boolean
}

export const Transcript = ({ transcriptHistory, isListening }: TranscriptProps) => {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Conversation Transcript</h2>

            {/* Transcript Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
                {transcriptHistory.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-8">
                        No conversation yet. Click "Start Chat" to begin.
                    </div>
                ) : (
                    transcriptHistory.map((entry, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg ${entry.type === 'user'
                                ? 'bg-blue-50 border-l-4 border-blue-500 ml-auto max-w-[80%]'
                                : 'bg-gray-50 border-l-4 border-gray-400 max-w-[80%]'
                                }`}
                        >
                            <div className="text-xs font-medium mb-1 text-gray-600">
                                {entry.type === 'user' ? 'You' : 'Character'}
                            </div>
                            <div className="text-sm text-gray-800">
                                {entry.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Listening Indicator */}
            {isListening && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <span className="text-sm text-green-700">Listening...</span>
                </div>
            )}
        </div>
    )
}
