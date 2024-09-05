'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Nav } from 'react-bootstrap'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      <h1 className="text-center mb-4">Golf Club Fitting Scheduler</h1>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Link href="/" passHref legacyBehavior>
            <Nav.Link active={pathname === '/'}>Book Fitting</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/manage" passHref legacyBehavior>
            <Nav.Link active={pathname === '/manage'}>Manage Bookings</Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
    </>
  )
}

// The usePathname hook in the Navigation component will ensure that the correct tab is highlighted based on the current route.
// Using Link components from Next.js ensures proper client-side navigation between the home and manage pages.
// The 'use client' directive on components that use hooks or interact with the browser ensures they're properly rendered on the client side.
