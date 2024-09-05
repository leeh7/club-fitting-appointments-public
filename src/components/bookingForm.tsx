import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAppStore } from '../store/store'

const schema = z.object({
  clientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
})

type FormData = z.infer<typeof schema>

function BookingForm() {
  const {
    selectedLocation,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    bookAppointment,
    getProviderSpecialties,
  } = useAppStore()

  const [bookingError, setBookingError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (
      !selectedLocation ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTimeSlot
    ) {
      setBookingError(
        'Incomplete booking details. Please select all required fields.'
      )
      return
    }

    // Filter services to only include those that the provider can offer
    const providerSpecialties = getProviderSpecialties(
      selectedTimeSlot.providerId
    )
    const validServiceIds = selectedServices
      .filter((service) =>
        providerSpecialties.some((specialty) => specialty.id === service.id)
      )
      .map((service) => service.id)

    if (validServiceIds.length === 0) {
      setBookingError('No valid services selected for this provider')
      return
    }

    try {
      await bookAppointment({
        locationId: selectedLocation.id,
        serviceIds: validServiceIds,
        providerId: selectedTimeSlot.providerId,
        date: selectedDate.toISOString().split('T')[0], // Send date as YYYY-MM-DD
        time: selectedTimeSlot.time,
        clientName: data.clientName.trim(),
      })
      reset()
      setBookingError(null)
      alert('Booking successful!')
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingError(
        error instanceof Error
          ? error.message
          : 'Booking failed. Please try again.'
      )
    }
  }

  if (
    !selectedLocation ||
    selectedServices.length === 0 ||
    !selectedDate ||
    !selectedTimeSlot
  ) {
    return (
      <Alert variant="warning">
        Please select all booking details before submitting.
      </Alert>
    )
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                {...register('clientName')}
                isInvalid={!!errors.clientName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.clientName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid gap-2 mb-3">
              <Button variant="primary" type="submit">
                Book Appointment
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default BookingForm
