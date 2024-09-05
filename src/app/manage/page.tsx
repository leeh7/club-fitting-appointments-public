'use client'

import { useAppStore } from '@/store/store'
import { Service } from '@/types'
import { useState } from 'react'
import { Badge, Button, Modal, Table } from 'react-bootstrap'
import useSWR from 'swr'

const styles = {
  badge: {
    fontSize: '0.8rem',
    margin: '0.1rem',
  },
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
  },
}

export default function Manage() {
  const { cancelAppointment, fetchAppointments } = useAppStore()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  )

  const handleCancelClick = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await cancelAppointment(appointmentToCancel)
        setShowCancelModal(false)
        mutate()
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to cancel appointment. Please try again.'
        )
      }
    }
  }

  const {
    data: appointments,
    error,
    isLoading,
    mutate,
  } = useSWR('/api/appointments', fetchAppointments)

  if (error) return <div>Failed to load appointments</div>
  if (isLoading) return <div>Loading appointments...</div>
  if (!appointments)
    return <div>No appointments found, please refresh the page.</div>

  const renderServiceBadges = (services: Service[]) => {
    return (
      <div style={styles.badgeContainer}>
        {services.map((service) => (
          <Badge key={service.id} bg="info" style={styles.badge}>
            {service.name}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Services</th>
                <th>Provider</th>
                <th>Client Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.locationName}</td>
                  <td>{renderServiceBadges(appointment.services)}</td>
                  <td>{appointment.providerName}</td>
                  <td>{appointment.clientName}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelClick(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Appointment
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Yes, Cancel Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
