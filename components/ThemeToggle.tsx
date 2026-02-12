"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-8 h-8" />; // Placeholder to avoid layout shift
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 focus:outline-none"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
            ) : (
                <Moon className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
            )}
        </button>
    );
};
