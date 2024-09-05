import { useAppStore } from '@/store/store'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { appointments, removeAppointment } = useAppStore.getState()
  const id = params.id
  const index = appointments.findIndex((appointment) => appointment.id === id)

  if (index === -1) {
    return NextResponse.json(
      { message: 'Appointment not found' },
      { status: 404 }
    )
  }
  const removedAppointment = appointments[index]
  // Remove the appointment from our shared appointments array
  removeAppointment(removedAppointment.id)

  return NextResponse.json({
    message: 'Appointment cancelled successfully',
    appointment: removedAppointment,
  })
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query

//   if (typeof id !== 'string') {
//     return res.status(400).json({ message: 'Invalid appointment ID' })
//   }

//   switch (req.method) {
//     case 'DELETE':
//       return handleDeleteAppointment(id, res)
//     default:
//       res.setHeader('Allow', ['DELETE'])
//       return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
//   }
// }

// async function handleDeleteAppointment(id: string, res: NextApiResponse) {
//   try {
//     const { appointments, removeAppointment} = useAppStore.getState()
//     console.log("APPOINTMENTS: ", appointments)
//     const index = appointments.findIndex((appointment: Appointment) => appointment.id === id)

//     if (index === -1) {
//       return res.status(404).json({ message: 'Appointment not found' })
//     }
//     const removedAppointment = appointments[index]
//     console.log("REMOVING APPOINTMENT: ", removedAppointment)
//     // Remove the appointment from our shared appointments array
//     removeAppointment(removedAppointment.id)
//     // In a real application, you might want to log this action or perform additional cleanup

//     return res.status(200).json({ message: 'Appointment cancelled successfully', appointment: removedAppointment })
//   } catch (error) {
//     console.error('Error cancelling appointment:', error)
//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }
