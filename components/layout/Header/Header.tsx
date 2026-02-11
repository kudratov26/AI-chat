import { Video, Mic } from 'lucide-react'

export const Header = () => {
  return (
    <nav className='flex justify-between items-center p-4 border-b border-gray-200 bg-white'>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-blue-100 rounded-lg'>
          <Video className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className='text-xl font-bold text-gray-900'>AI Character Chat</h1>
          <p className='text-xs text-gray-500'>Video conversation with speech recognition</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Mic className="w-4 h-4" />
        <span>Speech Enabled</span>
      </div>
    </nav>
  )
}
