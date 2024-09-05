import { NextResponse } from 'next/server'
import { Provider } from '../../../types'

// Mock golf fitting specialists data
const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'John Smith',
    locationId: '1',
    specialties: ['1', '2', '5'], // Driver Fitting, Iron Set Fitting, Full Bag Fitting
  },
  {
    id: '2',
    name: 'Emily Johnson',
    locationId: '1',
    specialties: ['3', '4', '9'], // Putter Fitting, Wedge Fitting, Golf Ball Fitting
  },
  {
    id: '3',
    name: 'Michael Chang',
    locationId: '2',
    specialties: ['6', '8', '15'], // Launch Monitor Session, Swing Analysis, Custom Club Building
  },
  {
    id: '4',
    name: 'Sarah Davis',
    locationId: '2',
    specialties: ['10', '11', '12'], // Junior Club Fitting, Fairway Wood Fitting, Hybrid Fitting
  },
  {
    id: '5',
    name: 'Robert Wilson',
    locationId: '3',
    specialties: ['5', '7', '13'], // Full Bag Fitting, Club Regripping, Loft and Lie Adjustment
  },
  {
    id: '6',
    name: 'Jessica Brown',
    locationId: '3',
    specialties: ['1', '2', '3'], // Driver Fitting, Iron Set Fitting, Putter Fitting
  },
  {
    id: '7',
    name: 'David Lee',
    locationId: '4',
    specialties: ['8', '6', '9'], // Swing Analysis, Launch Monitor Session, Golf Ball Fitting
  },
  {
    id: '8',
    name: 'Amanda Taylor',
    locationId: '4',
    specialties: ['4', '14', '15'], // Wedge Fitting, Club Repair, Custom Club Building
  },
  {
    id: '9',
    name: 'Thomas Garcia',
    locationId: '5',
    specialties: ['5', '1', '2'], // Full Bag Fitting, Driver Fitting, Iron Set Fitting
  },
  {
    id: '10',
    name: 'Laura Martinez',
    locationId: '5',
    specialties: ['10', '3', '9'], // Junior Club Fitting, Putter Fitting, Golf Ball Fitting
  },
]

export async function GET() {
  return NextResponse.json(mockProviders)
}

export function getProvidersByLocation(locationId: string): Provider[] {
  return mockProviders.filter((provider) => provider.locationId === locationId)
}

export function getProviderById(id: string): Provider | undefined {
  return mockProviders.find((provider) => provider.id === id)
}
