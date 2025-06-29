import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Global American LLC - Logistics Solutions',
  description: 'Comprehensive logistics solutions for modern commerce. Air freight, ocean freight, express courier, and 3PL services worldwide.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
