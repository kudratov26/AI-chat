import { Video } from 'lucide-react'
import { Status } from '@/components/Status'

export const Header = () => {
  return (
    <nav className='flex justify-between items-center p-2'>
      <div className='flex items-center gap-2'>
        <div className='p-1 bg-green-300 rounded-sm'>
          <Video />
        </div>
        <h1 className='text-xl font-bold text-black dark:text-white'>AI Chat</h1>
      </div>
      <Status status='Listening' />
    </nav>
  )
}
