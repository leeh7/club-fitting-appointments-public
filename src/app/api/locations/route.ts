import { NextResponse } from 'next/server'
import { Location } from '../../../types'

// Mock golf shop locations data
const mockLocations: Location[] = [
  { id: '1', name: 'Fairway Dreams Golf Shop' },
  { id: '2', name: 'Birdie Bliss Pro Shop' },
  { id: '3', name: "Eagle's Nest Golf Center" },
  { id: '4', name: 'Hole-in-One Fitting Studio' },
  { id: '5', name: 'Green Valley Golf Emporium' },
]

export async function GET() {
  return NextResponse.json(mockLocations)
}
