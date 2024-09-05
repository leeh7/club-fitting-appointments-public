import { ReactNode } from 'react'
import { getBaseUrl } from '../utils/utils'

async function fetchInitialData() {
  const baseUrl = getBaseUrl()
  const locations = await fetch(`${baseUrl}/api/locations`).then((res) =>
    res.json()
  )
  const services = await fetch(`${baseUrl}/api/services`).then((res) =>
    res.json()
  )
  const providers = await fetch(`${baseUrl}/api/providers`).then((res) =>
    res.json()
  )
  const appointments = await fetch(`${baseUrl}/api/appointments`).then((res) =>
    res.json()
  )

  return { locations, services, providers, appointments }
}

export default async function InitialDataFetcher({
  children,
}: {
  children: ReactNode
}) {
  //   const initialData = await fetchInitialData()

  //   useAppStore.setState({
  //     locations: initialData.locations,
  //     services: initialData.services,
  //     providers: initialData.providers,
  //     appointments: initialData.appointments,
  //   })

  return <>{children}</>
}
