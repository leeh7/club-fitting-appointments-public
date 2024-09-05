// import { NextResponse } from 'next/server'
// import { TimeSlot } from '../../../types'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const locationId = searchParams.get('locationId')
//   const serviceId = searchParams.get('serviceId')
//   const date = searchParams.get('date')

//   // This is a mock implementation. In a real app, you would query your database
//   // based on the locationId, serviceId, and date to find actual available slots.
//   const mockTimeSlots: TimeSlot[] = [
//     { time: '8:00 AM', providerId: '1' },
//     { time: '9:30 AM', providerId: '2' },
//     { time: '11:00 AM', providerId: '3' },
//     { time: '1:00 PM', providerId: '4' },
//     { time: '2:30 PM', providerId: '5' },
//     { time: '4:00 PM', providerId: '6' },
//   ]

//   //console.log('GETTING TIME SLOTS: ', { locationId, serviceId, date })

//   // Filter mock time slots based on the locationId
//   const filteredTimeSlots = mockTimeSlots.filter((slot) => {
//     const providerId = parseInt(slot.providerId)
//     // console.log(
//     //   'FILTER TIME SLOTS: ',
//     //   providerId,
//     //   providerId <= 2 * parseInt(locationId || '0')
//     // )
//     return providerId <= 2 * parseInt(locationId || '0')
//   })

//   return NextResponse.json(filteredTimeSlots)
// }

// Key changes in these refactored Route Handlers:

// They're now placed in the app/api directory instead of pages/api.
// We're using the NextResponse object from next/server to send JSON responses.
// Instead of exporting a default function, we're exporting named async functions (GET in this case) that correspond to HTTP methods.
// For availableTimeSlots, we're now using searchParams from the URL object to get query parameters, as req.query is no longer available in Route Handlers.

// These Route Handlers will work similarly to the previous API Routes, but they're more aligned with the new app directory structure in Next.js 13. Remember to update any client-side code that calls these endpoints to handle the responses from these new Route Handlers.

// import { NextResponse } from 'next/server'
// import { Service, TimeSlot } from '../../../types'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const locationId = searchParams.get('locationId')
//   const serviceIds = searchParams.get('serviceIds')?.split(',') || []
//   const date = searchParams.get('date')

//   // Mock services (in a real app, you'd fetch these from a database)
//   const mockServices: Service[] = [
//     { id: '1', name: 'Driver Fitting', duration: 60 },
//     { id: '2', name: 'Iron Fitting', duration: 60 },
//     { id: '3', name: 'Putter Fitting', duration: 30 },
//     { id: '4', name: 'Wedge Fitting', duration: 45 },
//   ]

//   // This is a mock implementation. In a real app, you would query your database
//   // based on the locationId, serviceIds, and date to find actual available slots.
//   const mockTimeSlots: (TimeSlot & { availableServices: Service[] })[] = [
//     {
//       time: '8:00 AM',
//       providerId: '1',
//       availableServices: [mockServices[0], mockServices[1]],
//     },
//     {
//       time: '9:30 AM',
//       providerId: '2',
//       availableServices: [mockServices[1], mockServices[2]],
//     },
//     {
//       time: '11:00 AM',
//       providerId: '3',
//       availableServices: [mockServices[2], mockServices[3]],
//     },
//     { time: '1:00 PM', providerId: '4', availableServices: mockServices },
//     {
//       time: '2:30 PM',
//       providerId: '5',
//       availableServices: [mockServices[0], mockServices[3]],
//     },
//     {
//       time: '4:00 PM',
//       providerId: '6',
//       availableServices: [mockServices[1], mockServices[2]],
//     },
//   ]

//   // Filter mock time slots based on the locationId and requested services
//   const filteredTimeSlots = mockTimeSlots.filter((slot) => {
//     const providerId = parseInt(slot.providerId)
//     const hasRequestedService = serviceIds.some((id) =>
//       slot.availableServices.some((service) => service.id === id)
//     )
//     return providerId <= 2 * parseInt(locationId || '0') && hasRequestedService
//   })

//   return NextResponse.json(filteredTimeSlots)
// }

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

// Explanation of the changes:

// Expanded mock services:
// We've increased the number of mock services from 4 to 8, adding more variety to our test data. This includes services like "Full Bag Fitting", "Launch Monitor Session", "Club Regripping", and "Swing Analysis".
// Helper function for random services:
// We've added a getRandomServices function that returns a random subset of services. This helps in creating diverse availability scenarios.
// More diverse mockTimeSlots:
// We've created a larger set of mock time slots (16 in total) with varied service availability:

// Some slots have randomly selected services (using getRandomServices).
// Some slots have specific service combinations (e.g., only Full Bag Fitting, or Launch Monitor and Swing Analysis).
// One slot has all services available.
// Some slots have services filtered based on duration.
// One slot has only a single service available (Club Regripping).

// Updated filtering logic:

// We've adjusted the provider ID check to allow for more time slots per location.
// The filtering now returns all time slots if no specific services are requested (serviceIds.length === 0).

// More realistic time slots:
// We've used 30-minute intervals for time slots, which is more typical for a golf fitting service.

// This diverse set of mock data will allow for more comprehensive testing of your frontend components. It simulates various real-world scenarios, such as:

// Limited availability of certain services
// Varying service combinations at different times
// Times when all or only one service is available
// Different providers available at different times
