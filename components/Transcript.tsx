"use client";

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TranscriptProps {
    transcriptHistory: Array<{ text: string; type: "user" | "system" }>
    interimTranscript?: string
}

export const Transcript = ({ transcriptHistory, interimTranscript }: TranscriptProps) => {
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted-foreground/30 text-[10px] font-mono uppercase tracking-widest py-10 text-center"
                        >
                            --- No active transmission ---
                        </motion.div>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <AnimatePresence initial={false}>
                                {transcriptHistory.map((entry, index) => (
                                    <motion.div
                                        key={index + entry.text}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-sm leading-relaxed flex items-start"
                                    >
                                        <span className="font-mono text-[11px] uppercase tracking-tighter text-muted-foreground mr-3 min-w-[30px] inline-block opacity-50">
                                            {entry.type === 'user' ? 'Me:' : 'AI:'}
                                        </span>
                                        <span className={entry.type === 'user' ? 'text-foreground/90' : 'text-foreground font-medium'}>
                                            {entry.text}
                                        </span>
                                    </motion.div>
                                ))}

                                {interimTranscript && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        className="text-sm leading-relaxed flex items-start"
                                    >
                                        <span className="font-mono text-[11px] uppercase tracking-tighter text-muted-foreground mr-3 min-w-[30px] inline-block opacity-50">
                                            Me:
                                        </span>
                                        <span className="text-foreground italic">
                                            {interimTranscript}
                                            <motion.span
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                            >
                                                _
                                            </motion.span>
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
