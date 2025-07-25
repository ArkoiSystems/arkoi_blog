import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import SectionContainer from './SectionContainer'
import Footer from './Footer'
import Header from './Header'

const inter = Inter({
  subsets: ['latin'],
})

export interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <SectionContainer>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}
