import { useAppStore } from '@/store/store'
import { Appointment } from '@/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const { appointments } = useAppStore.getState()
  return NextResponse.json(appointments)
}

//We add validation to ensure all required fields are present in the appointment data.
// We filter the services again on the server-side to ensure only valid services for the provider are included in the appointment.
// We use the addAppointment function from the store to add the new appointment, ensuring consistency with the store's state.
// export async function POST(request: Request) {
//   const { addAppointment, getProviderSpecialties } = useAppStore.getState()

//   const newAppointment: Omit<Appointment, 'id' | 'timeOfBooking'> =
//     await request.json()

//   console.log(
//     'NEW APPOINT POST: ',
//     newAppointment,
//     !newAppointment.locationId ||
//       !newAppointment.providerId ||
//       !newAppointment.date ||
//       !newAppointment.time ||
//       !newAppointment.clientName ||
//       !Array.isArray(newAppointment.services) ||
//       newAppointment.services.length === 0
//   )

//   // Validate the appointment data
//   if (
//     !newAppointment.locationId ||
//     !newAppointment.providerId ||
//     !newAppointment.date ||
//     !newAppointment.time ||
//     !newAppointment.clientName ||
//     !Array.isArray(newAppointment.services) ||
//     newAppointment.services.length === 0
//   ) {
//     return NextResponse.json(
//       { error: 'Invalid appointment data' },
//       { status: 400 }
//     )
//   }

//   // Ensure only valid services for the provider are included
//   const providerSpecialties = getProviderSpecialties(newAppointment.providerId)
//   const validServices = newAppointment.services.filter((service: Service) =>
//     providerSpecialties.some((specialty) => specialty.id === service.id)
//   )

//   if (validServices.length === 0) {
//     return NextResponse.json(
//       { error: 'No valid services selected for this provider' },
//       { status: 400 }
//     )
//   }

//   const finalAppointment: Appointment = {
//     ...newAppointment,
//     id: crypto.randomUUID(),
//     timeOfBooking: new Date().toISOString(),
//     services: validServices,
//   }

//   console.log('ROUTE APPOINTMENT POST: ', finalAppointment)

//   addAppointment(finalAppointment)
//   return NextResponse.json(finalAppointment, { status: 201 })
// }
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

  //   const provider = providers.find((p) => p.id === newAppointment.providerId)

  //   // Filter available services based on provider specialties and selected services
  //   const availableServicesForSlot = providerSpecialties.filter(
  //     (service) =>
  //       providerSpecialties.some((specialty) => specialty.id === service.id) &&
  //       newAppointment.services.some(
  //         (newAppointmentService) => newAppointmentService.id === service.id
  //       )
  //   )

  //   console.log(
  //     'AVAILABLE APPOINTMENTS FOR SLOT ROUTE: ',
  //     provider,
  //     availableServicesForSlot
  //   )

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

// export async function POST(request: Request) {
//   const { addAppointment, getProviderSpecialties } = useAppStore.getState()

//   const newAppointment: Omit<Appointment, 'id' | 'timeOfBooking'> =
//     await request.json()

//   // Debug logging
//   console.log('Received appointment data:', newAppointment)
//   console.log('locationId exists:', !!newAppointment.locationId)
//   console.log('providerId exists:', !!newAppointment.providerId)
//   console.log('date exists:', !!newAppointment.date)
//   console.log('time exists:', !!newAppointment.time)
//   console.log('clientName exists:', !!newAppointment.clientName)
//   console.log('services is an array:', Array.isArray(newAppointment.services))
//   console.log('services array length:', newAppointment.services?.length ?? 0)

//   // Validate the appointment data
//   if (!newAppointment.locationId) {
//     return NextResponse.json(
//       { error: 'locationId is missing' },
//       { status: 400 }
//     )
//   }
//   if (!newAppointment.providerId) {
//     return NextResponse.json(
//       { error: 'providerId is missing' },
//       { status: 400 }
//     )
//   }
//   if (!newAppointment.date) {
//     return NextResponse.json({ error: 'date is missing' }, { status: 400 })
//   }
//   if (!newAppointment.time) {
//     return NextResponse.json({ error: 'time is missing' }, { status: 400 })
//   }
//   if (!newAppointment.clientName) {
//     return NextResponse.json(
//       { error: 'clientName is missing' },
//       { status: 400 }
//     )
//   }
//   if (!Array.isArray(newAppointment.services)) {
//     return NextResponse.json(
//       { error: 'services is not an array' },
//       { status: 400 }
//     )
//   }
//   if (newAppointment.services.length === 0) {
//     return NextResponse.json(
//       { error: 'services array is empty' },
//       { status: 400 }
//     )
//   }

//   // Ensure only valid services for the provider are included
//   const providerSpecialties = getProviderSpecialties(newAppointment.providerId)
//   const validServices = newAppointment.services.filter((service: Service) =>
//     providerSpecialties.some((specialty) => specialty.id === service.id)
//   )

//   if (validServices.length === 0) {
//     console.log("INVALID SERVICES LENGTH: ", validServices)
//     return NextResponse.json(
//       { error: 'No valid services selected for this provider' },
//       { status: 400 }
//     )
//   }

//   const finalAppointment: Appointment = {
//     ...newAppointment,
//     id: crypto.randomUUID(),
//     timeOfBooking: new Date().toISOString(),
//     services: validServices,
//   }

//   addAppointment(finalAppointment)
//   return NextResponse.json(finalAppointment, { status: 201 })
// }
