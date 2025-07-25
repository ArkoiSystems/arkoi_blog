'use client'

import { ThemeProvider } from 'next-themes'
import React from 'react'

import siteMetadata from '@/data/siteMetadata'

export interface ThemeProvidersProps {
  children: React.ReactNode
}

export function ThemeProviders({ children }: ThemeProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
