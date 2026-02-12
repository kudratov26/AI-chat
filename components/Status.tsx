import React from 'react'

type StatusType = 'listening' | 'processing' | 'error' | 'idle'

interface StatusProps {
    status: string
    type?: StatusType
}

const statusConfig = {
    listening: {
        bgClass: 'bg-green-500/10 dark:bg-green-500/20 border-green-500/50 dark:border-green-500',
        dotClass: 'bg-green-500',
        textClass: 'text-green-700 dark:text-green-400'
    },
    processing: {
        bgClass: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/50 dark:border-blue-500',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-700 dark:text-blue-400'
    },
    error: {
        bgClass: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/50 dark:border-red-500',
        dotClass: 'bg-red-500',
        textClass: 'text-red-700 dark:text-red-400'
    },
    idle: {
        bgClass: 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/50 dark:border-slate-500',
        dotClass: 'bg-slate-500',
        textClass: 'text-slate-700 dark:text-slate-400'
    }
}

export const Status = ({ status, type = 'idle' }: StatusProps) => {
    const config = statusConfig[type]

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgClass}`}>
            <span className={`rounded-full w-2 h-2 ${config.dotClass} ${type === 'listening' ? 'animate-pulse' : ''}`}></span>
            <span className={`text-xs font-semibold ${config.textClass}`}>{status}</span>
        </div>
    )
}
