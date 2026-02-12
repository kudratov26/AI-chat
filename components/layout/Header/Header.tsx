'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Video } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const Header = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  return (
    <nav className='p-4 border-b border-border bg-background'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className='text-xl font-bold text-foreground'>AI Chat</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ThemeToggle />
          <span className="opacity-50">[</span>
          <span className="min-w-[40px] text-center font-mono uppercase tracking-wider">
            {mounted ? theme : '...'}
          </span>
          <span className="opacity-50">]</span>
        </div>
      </div>
    </nav>
  )
}