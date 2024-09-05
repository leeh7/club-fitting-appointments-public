import { getBaseUrl } from '@/utils/utils'
import { create } from 'zustand'
import {
  Appointment,
  AvailableTimeSlot,
  BookAppointmentParams,
  Location,
  Provider,
  Service,
  TimeSlot,
} from '../types'

interface AppState {
  locations: Location[]
  services: Service[]
  providers: Provider[]
  selectedLocation: Location | null
  selectedServices: Service[]
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  availableTimeSlots: AvailableTimeSlot[]
  appointments: Appointment[]
  error: string | null

  getProviderSpecialties: (providerId: string) => Service[]
  setLocations: (locations: Location[]) => void
  setServices: (services: Service[]) => void
  setProviders: (providers: Provider[]) => void
  setSelectedLocation: (location: Location | null) => void
  setSelectedServices: (services: Service[]) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void
  setAvailableTimeSlots: (timeSlots: AvailableTimeSlot[]) => void
  addAppointment: (appointment: Appointment) => void
  setError: (error: string | null) => void
  toggleSelectedService: (service: Service) => void
  removeAppointment: (appointmentId: string) => void

  fetchLocations: () => Promise<Location[] | null>
  fetchServices: () => Promise<Service[] | null>
  fetchProviders: () => Promise<void>
  fetchAppointments: () => Promise<Appointment[] | null>
  fetchAvailableTimeSlots: () => Promise<AvailableTimeSlot[] | null>
  bookAppointment: (params: BookAppointmentParams) => Promise<void>
  cancelAppointment: (appointmentId: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  locations: [],
  services: [],
  providers: [],
  selectedLocation: null,
  selectedServices: [],
  selectedDate: null,
  selectedTimeSlot: null,
  availableTimeSlots: [],
  appointments: [],
  error: null,

  getProviderSpecialties: (providerId: string) => {
    const { providers, services } = get()
    // console.log('All providers:', providers)
    // console.log('Provider ID:', providerId)

    const provider = providers.find((p) => p.id === providerId)
    // console.log('Found provider:', provider)

    if (!provider) {
      console.log('Provider not found')
      return []
    }

    // console.log('Provider specialties:', provider.specialties)

    const filteredServices = services.filter((service) =>
      provider.specialties.includes(service.id)
    )
    // console.log('Filtered services:', filteredServices)

    return filteredServices
  },

  setLocations: (locations) => set({ locations }),
  setServices: (services) => set({ services }),
  setProviders: (providers) => set({ providers }),
  setSelectedLocation: (location) => {
    set({ selectedLocation: location })
  },
  setSelectedServices: (services) => {
    set({ selectedServices: services })
  },
  setSelectedDate: (date) => {
    set({ selectedDate: date })
  },
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  setAvailableTimeSlots: (timeSlots: AvailableTimeSlot[]) =>
    set({ availableTimeSlots: timeSlots }),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  removeAppointment: (appointmentId: string) => {
    set((state) => ({
      appointments: state.appointments.filter(
        (appointment) => appointment.id !== appointmentId
      ),
    }))
  },

  setError: (error) => set({ error }),
  toggleSelectedService: (service) => {
    set((state) => {
      const isSelected = state.selectedServices.some((s) => s.id === service.id)
      const newSelectedServices = isSelected
        ? state.selectedServices.filter((s) => s.id !== service.id)
        : [...state.selectedServices, service]
      return { selectedServices: newSelectedServices }
    })
  },

  fetchLocations: async () => {
    try {
      const baseUrl = getBaseUrl()

      const response = await fetch(`${baseUrl}/api/locations`)
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data: Location[] = await response.json()
      set({ locations: data })
      return data
    } catch (error) {
      console.error('Error fetching locations:', error)
      set({ error: 'Failed to load locations. Please refresh the page.' })
      return null
    }
  },

  fetchServices: async () => {
    try {
      const baseUrl = getBaseUrl()

      const response = await fetch(`${baseUrl}/api/services`)
      if (!response.ok) throw new Error('Failed to fetch services')
      const data: Service[] = await response.json()
      set({ services: data })
      return data
    } catch (error) {
      console.error('Error fetching services:', error)
      set({ error: 'Failed to load services. Please refresh the page.' })
      return null
    }
  },

  fetchProviders: async () => {
    try {
      const baseUrl = getBaseUrl()

      const response = await fetch(`${baseUrl}/api/providers`)
      if (!response.ok) throw new Error('Failed to fetch providers')
      const data: Provider[] = await response.json()
      set({ providers: data })
    } catch (error) {
      console.error('Error fetching providers:', error)
      set({ error: 'Failed to load providers. Please refresh the page.' })
    }
  },

  fetchAppointments: async () => {
    try {
      const baseUrl = getBaseUrl()

      const response = await fetch('/api/appointments')
      if (!response.ok) throw new Error('Failed to fetch appointments')
      const appointments = await response.json()
      set({ appointments })
      return appointments
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return null
    }
  },
  fetchAvailableTimeSlots: async () => {
    const { selectedLocation, selectedServices, selectedDate } = get()
    if (!selectedLocation || selectedServices.length === 0 || !selectedDate) {
      set({ availableTimeSlots: [] })
      return []
    }

    try {
      const serviceIds = selectedServices.map((s) => s.id).join(',')
      const response = await fetch(
        `/api/availableTimeSlots?locationId=${selectedLocation.id}&serviceIds=${serviceIds}&date=${selectedDate.toISOString().split('T')[0]}`
      )
      if (!response.ok) throw new Error('Failed to fetch available time slots')
      const data: AvailableTimeSlot[] = await response.json()
      set({ availableTimeSlots: data })
      return data
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      set({ error: 'Failed to load available time slots. Please try again.' })
      return []
    }
  },

  bookAppointment: async (params: BookAppointmentParams) => {
    const { locationId, serviceIds, providerId, date, time, clientName } =
      params
    const { locations, services, providers } = get()

    const location = locations.find((l) => l.id === locationId)
    const provider = providers.find((p) => p.id === providerId)

    if (!location || !provider) {
      throw new Error('Invalid location or provider')
    }

    // Filter services to only include those that the provider can offer
    const providerServices = services.filter(
      (s) => serviceIds.includes(s.id) && provider.specialties.includes(s.id)
    )

    if (providerServices.length === 0) {
      throw new Error('No valid services selected for this provider')
    }

    const newAppointment: Omit<Appointment, 'id' | 'timeOfBooking'> = {
      locationId,
      locationName: location.name,
      services: providerServices,
      providerId,
      providerName: provider.name,
      date,
      time,
      clientName,
    }

    console.log('BOOKING APPOINTMENT INFO: ', newAppointment)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      })

      if (!response.ok) throw new Error('Failed to book appointment')

      const bookedAppointment: Appointment = await response.json()
      set((state) => ({
        appointments: [...state.appointments, bookedAppointment],
      }))
    } catch (error) {
      console.error('Error booking appointment:', error)
      throw error
    }
  },

  cancelAppointment: async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to cancel appointment')
      const data = await response.json()

      // Remove the appointment from the local state
      set((state) => ({
        appointments: state.appointments.filter((app) => app.id !== id),
      }))

      return data.appointment // Return the cancelled appointment if needed
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      throw error
    }
  },
}))
