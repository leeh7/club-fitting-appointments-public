import { Button, Modal } from 'react-bootstrap'

interface ConfirmationModalProps {
  show: boolean
  onHide: () => void
  appointmentDetails: Record<string, string>
}

function ConfirmationModal({
  show,
  onHide,
  appointmentDetails,
}: ConfirmationModalProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Appointment Confirmed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Your appointment has been booked successfully!</div>
        <div>Provider: {appointmentDetails.provider}</div>
        <div>Service: {appointmentDetails.service}</div>
        <div>Date: {appointmentDetails.date}</div>
        <div>Time: {appointmentDetails.time}</div>
        <div>Name: {appointmentDetails.clientName}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal
