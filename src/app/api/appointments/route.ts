import { useAppStore } from '@/store/store'
import { Appointment } from '@/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const { appointments } = useAppStore.getState()
  return NextResponse.json(appointments)
}

export async function POST(request: Request) {
  const { addAppointment, getProviderSpecialties, services, providers } =
    useAppStore.getState()

  const newAppointment: Omit<Appointment, 'id' | 'timeOfBooking'> =
    await request.json()

  console.log('NEW APPOINTMENT POST: ', newAppointment)
  console.log('All providers:', providers)
  console.log('All services:', services)

  // Validate the appointment data
  if (
    !newAppointment.locationId ||
    !newAppointment.providerId ||
    !newAppointment.date ||
    !newAppointment.time ||
    !newAppointment.clientName ||
    !Array.isArray(newAppointment.services) ||
    newAppointment.services.length === 0
  ) {
    return NextResponse.json(
      { error: 'Invalid appointment data' },
      { status: 400 }
    )
  }
  console.log('NEW APPOINTMENT services selected: ', newAppointment.services)

  const providerSpecialties = getProviderSpecialties(newAppointment.providerId)


  console.log('Provider Specialties:', providerSpecialties)

  const finalAppointment: Appointment = {
    ...newAppointment,
    id: crypto.randomUUID(),
    timeOfBooking: new Date().toISOString(),
    services: newAppointment.services,
  }

  console.log('FINAL APPOINTMENT:', finalAppointment)

  addAppointment(finalAppointment)
  return NextResponse.json(finalAppointment, { status: 201 })
}
