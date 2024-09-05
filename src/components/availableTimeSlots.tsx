'use client'

import { AvailableTimeSlot, Service } from '@/types'
import { Calendar, Clock, User } from 'lucide-react'
import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Alert, Badge, ListGroup, Pagination } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { useAppStore } from '../store/store'

/**
 * Styles Refactoring Explanation
 *
 * Approach:
 * 1. Define a 'Styles' type that explicitly declares the shape of the styles object.
 *    This includes specifying which properties are strings (for CSS classes)
 *    and which are CSSProperties (for inline styles).
 * 2. Import CSSProperties from React to use proper CSS property types.
 * 3. Define the styles object using the 'Styles' type for type checking.
 * 4. Use standard CSS property names and values without 'as const' assertions.
 *
 * Benefits:
 * 1. Improved Type Safety: TypeScript catches misspellings and invalid CSS
 *    properties at compile-time.
 * 2. Better Readability: The structure of styles is clearly defined in the 'Styles' type.
 * 3. Cleaner Code: Eliminates the need for 'as const' assertions.
 * 4. Enhanced Developer Experience: Allows for easier autocompletion and
 *    IntelliSense in TypeScript-aware IDEs.
 * 5. Maintainability: Makes the code more robust and easier to maintain while
 *    preserving functionality.
 *
 * This refactoring approach is recommended for handling styles in TypeScript
 * React components, as it combines type safety with clean, maintainable code.
 */

// Define a type for the styles
type Styles = {
  heading: string
  listContainer: CSSProperties
  listItem: string
  badge: CSSProperties
  badgeContainer: string
  timeProviderContainer: string
  time: string
  provider: string
  icon: CSSProperties
  paginationContainer: string
}

// Define the styles object with the correct type
const styles: Styles = {
  heading: 'mb-3',
  listContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  listItem: 'p-3',
  badge: {
    fontSize: '0.8rem',
    whiteSpace: 'normal',
    textAlign: 'left',
    marginRight: '0.25rem',
    marginBottom: '0.25rem',
  },
  badgeContainer: 'd-flex flex-wrap mt-2',
  timeProviderContainer: 'd-flex justify-content-between align-items-center',
  time: 'me-2 d-flex align-items-center',
  provider: 'text-end d-flex align-items-center justify-content-end',
  icon: {
    marginRight: '0.5rem',
  },
  paginationContainer: 'mt-3 d-flex justify-content-center',
}

// Number of items to display per page
const ITEMS_PER_PAGE = 5

export const AvailableTimeSlots: React.FC = () => {
  // Destructure necessary state and functions from the app store
  const {
    providers,
    selectedLocation,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    fetchAvailableTimeSlots,
    fetchProviders,
    getProviderSpecialties,
  } = useAppStore()

  // State for managing pagination
  const [currentPage, setCurrentPage] = useState(1)
  const { setValue } = useForm()

  // Fetch providers if they haven't been loaded yet
  useEffect(() => {
    if (providers.length === 0) {
      fetchProviders()
    }
  }, [providers])

  // Construct the key for SWR based on selected criteria
  const swrKey =
    selectedLocation && selectedServices.length > 0 && selectedDate
      ? `/api/availableTimeSlots?locationId=${selectedLocation.id}&serviceIds=${selectedServices.map((s) => s.id).join(',')}&date=${selectedDate.toISOString().split('T')[0]}`
      : null

  // Fetch available time slots using SWR
  const {
    data: availableTimeSlots,
    error,
    isLoading,
  } = useSWR(swrKey, fetchAvailableTimeSlots, {
    focusThrottleInterval: 2000,
    dedupingInterval: 2000,
    keepPreviousData: true,
  })

  // Filter time slots based on provider specialties and selected services
  const filteredTimeSlots = useMemo(() => {
    if (!availableTimeSlots || !providers || selectedServices.length === 0) {
      return []
    }

    return availableTimeSlots.filter((slot) => {
      const provider = providers.find((p) => p.id === slot.providerId)
      if (!provider) {
        return false
      }

      const providerSpecialties = getProviderSpecialties(provider.id)
      const availableServicesForSlot = slot.availableServices.filter(
        (service) =>
          providerSpecialties.some(
            (specialty) => specialty.id === service.id
          ) &&
          selectedServices.some(
            (selectedService) => selectedService.id === service.id
          )
      )

      return availableServicesForSlot.length > 0
    })
  }, [availableTimeSlots, providers, selectedServices, getProviderSpecialties])

  // Reset to first page when filtered results change
  useEffect(() => {
    console.log('FILTERED CHANGED')
    setCurrentPage(1)
  }, [filteredTimeSlots])

  // Handle various loading and error states
  if (error) {
    return <Alert variant="danger">Failed to load available time slots.</Alert>
  }
  if (isLoading) {
    return <Alert variant="info">Loading available time slots...</Alert>
  }
  if (!availableTimeSlots) {
    return (
      <Alert variant="warning">
        No time slots found, please refresh the page.
      </Alert>
    )
  }

  // Check if all necessary selections have been made
  if (!selectedLocation || selectedServices.length === 0 || !selectedDate) {
    return (
      <Alert variant="info">
        Please select a location, at least one service, and a date to see
        available time slots.
      </Alert>
    )
  }

  // Show message if no time slots are available after filtering
  if (filteredTimeSlots.length === 0) {
    return (
      <Alert variant="info">
        No available time slots for the selected criteria.
      </Alert>
    )
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: AvailableTimeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setValue('time', parseInt(timeSlot.time.split(':')[0]))
  }

  // Render service badges
  const renderServiceBadges = (services: Service[]) => {
    return services.map((service) => (
      <Badge key={service.id} bg="info" style={styles.badge}>
        {service.name}
      </Badge>
    ))
  }

  // Calculate pagination
  const pageCount = Math.ceil(filteredTimeSlots.length / ITEMS_PER_PAGE)
  const paginatedTimeSlots = filteredTimeSlots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      {/* Heading with date */}
      <h2 className={styles.heading}>
        <Calendar style={styles.icon} />
        Available Time Slots for {selectedDate.toLocaleDateString()}
      </h2>
      {/* Scrollable container for time slots */}
      <div style={styles.listContainer}>
        <ListGroup>
          {paginatedTimeSlots.map((slot, index) => {
            const provider = providers.find((p) => p.id === slot.providerId)
            const providerSpecialties = provider
              ? getProviderSpecialties(provider.id)
              : []
            // Filter available services based on provider specialties and selected services
            const availableServicesForSlot = slot.availableServices.filter(
              (service) =>
                providerSpecialties.some(
                  (specialty) => specialty.id === service.id
                ) &&
                selectedServices.some(
                  (selectedService) => selectedService.id === service.id
                )
            )
            return (
              <ListGroup.Item
                key={index}
                action
                active={
                  selectedTimeSlot?.time === slot.time &&
                  selectedTimeSlot?.providerId === slot.providerId
                }
                onClick={() => handleTimeSlotSelect(slot)}
                className={styles.listItem}
              >
                {/* Time and provider information */}
                <div className={styles.timeProviderContainer}>
                  <div className={styles.time}>
                    <Clock style={styles.icon} />
                    <strong>{slot.time}</strong>
                  </div>
                  <div className={styles.provider}>
                    <User style={styles.icon} />
                    {provider ? provider.name : 'Loading provider...'}
                  </div>
                </div>
                {/* Service badges */}
                <div className={styles.badgeContainer}>
                  {renderServiceBadges(availableServicesForSlot)}
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </div>
      {/* Pagination */}
      {pageCount > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(pageCount)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(pageCount)}
              disabled={currentPage === pageCount}
            />
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default AvailableTimeSlots

/**
 * AvailableTimeSlots Component: Summary of Changes
 *
 * Layout and Styling Improvements:
 * 1. Restructured layout for better responsiveness:
 *    - Removed Bootstrap Row and Col components
 *    - Created a flex container for time and provider information
 *    - Placed service badges below time/provider info
 * 2. Updated styles for improved readability and layout control
 * 3. Implemented a scrollable container with max height to manage long lists
 *
 * Enhanced Functionality:
 * 1. Added pagination:
 *    - Imported Pagination component from react-bootstrap
 *    - Implemented logic to slice and display time slots in pages
 * 2. Improved filtering:
 *    - Created filteredTimeSlots using useMemo for performance
 *    - Ensured time slots only show if provider offers selected services
 * 3. Updated rendering logic to use filtered and paginated time slots
 *
 * Visual Enhancements:
 * 1. Added icons (Clock, User, Calendar) for better visual representation
 * 2. Updated heading to include the selected date
 *
 * Data Handling and Type Safety:
 * 1. Improved type safety with annotations for availableTimeSlots
 * 2. Enhanced service badge rendering to accurately reflect available services
 *
 * User Experience Improvements:
 * 1. Implemented conditional pagination rendering
 * 2. Added reset for current page when filtered results change
 * 3. Ensured no overlap between time/provider info and service badges
 *
 * Performance Considerations:
 * - Used useMemo for filtering to optimize performance
 * - Implemented client-side pagination for better data management
 *
 * These changes collectively improve the component's responsiveness,
 * functionality, and user experience, making it more efficient and
 * easier to use across various screen sizes.
 */
