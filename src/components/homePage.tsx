'use client'

import { Alert, Col, Row } from 'react-bootstrap'
import { useAppStore } from '../store/store'
import AvailableTimeSlots from './availableTimeSlots'
import BookingForm from './bookingForm'
import DatePicker from './datePicker'
import LocationList from './locationList'
import ServiceList from './serviceList'

export default function HomePage() {
  const { error } = useAppStore()

  return (
    <>
      {/* <Navigation /> */}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={3}>
          <LocationList />
        </Col>
        <Col md={3}>
          <ServiceList />
        </Col>
        <Col md={3}>
          <DatePicker />
        </Col>
        <Col md={3}>
          <AvailableTimeSlots />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <BookingForm />
        </Col>
      </Row>
    </>
  )
}
