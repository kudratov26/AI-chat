"use client";

import { useEffect, useRef } from 'react'

interface TranscriptProps {
    transcriptHistory: Array<{ text: string; type: "user" | "system" }>
    isListening: boolean
    interimTranscript?: string
}

export const Transcript = ({ transcriptHistory, isListening, interimTranscript }: TranscriptProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [transcriptHistory, interimTranscript]);

    return (
        <div className="flex flex-col">
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="h-[120px] overflow-y-auto space-y-1 py-2 scrollbar-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    {transcriptHistory.length === 0 && !interimTranscript ? (
                        <div className="text-gray-300 text-xs italic py-10">
                            Empty...
                        </div>
                    ) : (
                        <>
                            {transcriptHistory.map((entry, index) => (
                                <div
                                    key={index}
                                    className="text-sm leading-relaxed"
                                >
                                    <span className="font-mono text-[11px] uppercase tracking-tighter text-muted-foreground mr-2 min-w-[30px] inline-block">
                                        {entry.type === 'user' ? 'Me:' : 'AI:'}
                                    </span>
                                    <span className="text-foreground/80">
                                        {entry.text}
                                    </span>
                                </div>
                            ))}

                            {interimTranscript && (
                                <div className="text-sm leading-relaxed opacity-60">
                                    <span className="font-mono text-[11px] uppercase tracking-tighter text-muted-foreground mr-2 min-w-[30px] inline-block">
                                        Me:
                                    </span>
                                    <span className="text-foreground/60 italic">
                                        {interimTranscript}...
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
