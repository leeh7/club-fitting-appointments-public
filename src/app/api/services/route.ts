import { NextResponse } from 'next/server'
import { Service } from '../../../types'

// Mock golf club fitting services data
export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Driver Fitting', duration: 60 },
  { id: '2', name: 'Iron Set Fitting', duration: 90 },
  { id: '3', name: 'Putter Fitting', duration: 45 },
  { id: '4', name: 'Wedge Fitting', duration: 60 },
  { id: '5', name: 'Full Bag Fitting', duration: 120 },
  { id: '6', name: 'Launch Monitor Session', duration: 30 },
  { id: '7', name: 'Club Regripping', duration: 15 },
  { id: '8', name: 'Swing Analysis', duration: 45 },
  { id: '9', name: 'Golf Ball Fitting', duration: 30 },
  { id: '10', name: 'Junior Club Fitting', duration: 60 },
  { id: '11', name: 'Fairway Wood Fitting', duration: 45 },
  { id: '12', name: 'Hybrid Fitting', duration: 45 },
  { id: '13', name: 'Loft and Lie Adjustment', duration: 30 },
  { id: '14', name: 'Club Repair', duration: 30 },
  { id: '15', name: 'Custom Club Building', duration: 120 },
]

export async function GET() {
  return NextResponse.json(MOCK_SERVICES)
}

// Helper function to get a subset of services (for use in other parts of the application)
export function getRandomServices(count: number): Service[] {
  const shuffled = [...MOCK_SERVICES].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to get services by IDs (for use in other parts of the application)
export function getServicesByIds(ids: string[]): Service[] {
  return MOCK_SERVICES.filter((service) => ids.includes(service.id))
}

// Explanation of the changes:

// Expanded mock services:
// We've increased the number of mock services from 8 to 15, providing a more comprehensive list of golf club fitting services. This includes all the services mentioned in the previous mockTimeSlots, plus additional relevant services.
// Consistency with previous mockTimeSlots:
// We've ensured that all services mentioned in the previous mockTimeSlots are included here (Driver Fitting, Iron Fitting, Putter Fitting, Wedge Fitting, Full Bag Fitting, Launch Monitor Session, Club Regripping, and Swing Analysis).
// Additional services:
// We've added more golf-related services to provide a fuller picture of what a golf club fitting service might offer, such as Fairway Wood Fitting, Hybrid Fitting, Loft and Lie Adjustment, Club Repair, and Custom Club Building.
// Helper functions:
// We've added two helper functions that can be useful in other parts of the application:

// getRandomServices: Returns a random subset of services. This can be used to simulate varying availability of services at different times or locations.
// getServicesByIds: Returns services based on their IDs. This can be useful when you need to retrieve specific services, such as when processing a booking.

// Realistic durations:
// We've assigned realistic durations to each service, ranging from quick 15-minute services like Club Regripping to more comprehensive 120-minute services like Full Bag Fitting or Custom Club Building.

// This diverse set of mock services will allow for more comprehensive testing of your frontend components and provide a more realistic simulation of a golf club fitting service. It covers a wide range of services that a golfer might need, from basic club adjustments to full custom fittings.
