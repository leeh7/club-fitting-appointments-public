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
