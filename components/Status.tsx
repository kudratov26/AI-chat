import React from 'react'

type StatusType = 'listening' | 'processing' | 'error' | 'idle'

interface StatusProps {
    status: string
    type?: StatusType
}

const statusConfig = {
    listening: {
        bgClass: 'bg-green-500/20 border-green-500',
        dotClass: 'bg-green-500',
        textClass: 'text-green-700'
    },
    processing: {
        bgClass: 'bg-blue-500/20 border-blue-500',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-700'
    },
    error: {
        bgClass: 'bg-red-500/20 border-red-500',
        dotClass: 'bg-red-500',
        textClass: 'text-red-700'
    },
    idle: {
        bgClass: 'bg-gray-500/20 border-gray-500',
        dotClass: 'bg-gray-500',
        textClass: 'text-gray-700'
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
