"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiUrl, getAuthHeaders } from '@/lib/api-config';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage and API on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First check localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }

        // Then try to get from API if user is logged in
        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (token && currentUser._id) {
          const response = await fetch(getApiUrl(`api/users/${currentUser._id}/settings`), {
            headers: getAuthHeaders(),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.theme) {
              setTheme(data.theme);
              document.documentElement.classList.toggle('dark', data.theme === 'dark');
              localStorage.setItem('theme', data.theme);
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      
      // Update local state and localStorage immediately
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');

      // Update in backend if user is logged in
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (token && currentUser._id) {
        await fetch(getApiUrl(`api/users/${currentUser._id}/settings`), {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ theme: newTheme }),
        });
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
