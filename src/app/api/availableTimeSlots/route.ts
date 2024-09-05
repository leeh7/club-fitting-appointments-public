import { NextResponse } from 'next/server'
import { Service, TimeSlot } from '../../../types'
import { MOCK_SERVICES } from '../services/route'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locationId = searchParams.get('locationId')
  const serviceIds = searchParams.get('serviceIds')?.split(',') || []
  const date = searchParams.get('date')

  // Helper function to get random services
  const getRandomServices = (count: number) => {
    const shuffled = [...MOCK_SERVICES].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // This is a mock implementation with more diverse time slots and service availability
  const mockTimeSlots: (TimeSlot & { availableServices: Service[] })[] = [
    {
      time: '8:00 AM',
      providerId: '1',
      availableServices: getRandomServices(3),
    },
    {
      time: '8:30 AM',
      providerId: '2',
      availableServices: getRandomServices(2),
    },
    {
      time: '9:00 AM',
      providerId: '3',
      availableServices: getRandomServices(4),
    },
    { time: '9:30 AM', providerId: '1', availableServices: [MOCK_SERVICES[4]] }, // Only Full Bag Fitting
    { time: '10:00 AM', providerId: '2', availableServices: MOCK_SERVICES }, // All services available
    {
      time: '10:30 AM',
      providerId: '3',
      availableServices: getRandomServices(1),
    },
    {
      time: '11:00 AM',
      providerId: '1',
      availableServices: MOCK_SERVICES.filter((s) => s.duration <= 45),
    },
    {
      time: '11:30 AM',
      providerId: '2',
      availableServices: getRandomServices(3),
    },
    {
      time: '1:00 PM',
      providerId: '3',
      availableServices: [MOCK_SERVICES[5], MOCK_SERVICES[7]],
    }, // Launch Monitor and Swing Analysis
    {
      time: '1:30 PM',
      providerId: '1',
      availableServices: getRandomServices(2),
    },
    {
      time: '2:00 PM',
      providerId: '2',
      availableServices: MOCK_SERVICES.filter((s) => s.id !== '5'),
    }, // All except Full Bag Fitting
    {
      time: '2:30 PM',
      providerId: '3',
      availableServices: getRandomServices(3),
    },
    { time: '3:00 PM', providerId: '1', availableServices: [MOCK_SERVICES[6]] }, // Only Club Regripping
    {
      time: '3:30 PM',
      providerId: '2',
      availableServices: getRandomServices(4),
    },
    {
      time: '4:00 PM',
      providerId: '3',
      availableServices: MOCK_SERVICES.filter((s) => s.duration >= 45),
    },
    {
      time: '4:30 PM',
      providerId: '1',
      availableServices: getRandomServices(2),
    },
  ]

  // Filter mock time slots based on the locationId and requested services
  const filteredTimeSlots = mockTimeSlots.filter((slot) => {
    const providerId = parseInt(slot.providerId)
    const hasRequestedService =
      serviceIds.length === 0 ||
      serviceIds.some((id) =>
        slot.availableServices.some((service) => service.id === id)
      )
    return providerId <= 3 * parseInt(locationId || '0') && hasRequestedService
  })

  return NextResponse.json(filteredTimeSlots)
}
