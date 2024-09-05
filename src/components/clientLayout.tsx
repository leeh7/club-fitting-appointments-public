'use client'

import { ReactNode } from 'react'
import { Container } from 'react-bootstrap'
import BootstrapClient from './bootstrapClient'
import Navigation from './navigation'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BootstrapClient />
      <Container className="mt-5">
        <Navigation />
        {children}
      </Container>
    </>
  )
}
