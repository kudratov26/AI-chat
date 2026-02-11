import React from 'react'
import { VideoPlayer } from './VideoPlayer'

export const Chat = () => {
    return (
        <div className='flex items-center justify-center'>
            <VideoPlayer
                currentVideo=""
                currentSource=""
                isMuted={false}
                isLooping={false}
                onVideoEnded={() => { }}
            />
        </div>
    )
}
