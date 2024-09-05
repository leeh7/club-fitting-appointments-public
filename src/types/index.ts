export interface Location {
  id: string
  name: string
}

export interface Provider {
  id: string
  name: string
  locationId: string
  specialties: string[] // IDs of services this provider can offer
}

export interface Service {
  id: string
  name: string
  duration: number
}

export interface Appointment {
  id: string
  locationId: string
  locationName: string
  services: Service[]
  providerId: string
  providerName: string
  date: string
  time: string
  timeOfBooking: string
  clientName: string
}

export interface TimeSlot {
  time: string
  providerId: string
}

export interface AvailableTimeSlot extends TimeSlot {
  availableServices: Service[]
}

export interface BookAppointmentParams {
  locationId: string
  serviceIds: string[]
  providerId: string
  date: string
  time: string
  clientName: string
}
