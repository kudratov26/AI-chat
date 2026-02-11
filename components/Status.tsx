import React from 'react'

export const Status = ({
    status
}: {
    status: string;
}) => {
    return (
        <div className={`flex items-center gap-2 bg-yellow-500/50 px-2 py-1 rounded-full`}>
            <span className={`rounded-full w-2 h-2 bg-yellow-500`}></span>
            <span className={`text-xs font-semibold text-yellow-500`}>{status}</span>
        </div>
    )
}
