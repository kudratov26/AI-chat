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

            </div>
        </div>
    )
}
