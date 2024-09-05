import React, { ReactNode } from 'react'
import ClientLayout from '../components/clientLayout'
import '../styles/globals.css'

export const metadata = {
  title: 'Golf Club Fitting Scheduler',
  description: 'Schedule your golf club fitting appointment',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
// This approach separates the server-side layout (which handles the overall HTML structure and metadata) from the client-side layout (which handles React context providers and client-side-only components).
// The ClientLayout component is marked with 'use client' at the top, which tells Next.js that this component and its children should be rendered on the client side. This is where we put the SSRProvider and BootstrapClient components.
// The root layout.tsx remains a server component, which is more efficient and allows for better SEO and initial page load performance.
// This  structure should resolve the error you're seeing and allow your app to work correctly with both server and client components in Next.js 13.
