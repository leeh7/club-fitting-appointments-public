import { Form, ListGroup } from 'react-bootstrap'
import useSWR from 'swr'
import { useAppStore } from '../store/store'

function ServiceList() {
  const { selectedServices, toggleSelectedService, fetchServices } =
    useAppStore()

  const {
    data: services,
    error,
    isLoading,
  } = useSWR('/api/services', fetchServices)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!services) return <div>No Services found, please refresh the page.</div>

  return (
    <div>
      <h2>Select Services</h2>
      <ListGroup>
        {services.map((service) => (
          <ListGroup.Item
            key={service.id}
            action
            onClick={() => toggleSelectedService(service)}
            active={selectedServices.some((s) => s.id === service.id)}
          >
            <Form.Check
              type="checkbox"
              label={`${service.name} (${service.duration} minutes)`}
              checked={selectedServices.some((s) => s.id === service.id)}
              onChange={() => toggleSelectedService(service)}
              onClick={(e) => e.stopPropagation()}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default ServiceList
