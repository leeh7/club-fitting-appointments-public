import { ListGroup } from 'react-bootstrap'
import useSWR from 'swr'
import { useAppStore } from '../store/store'

function LocationList() {
  const { selectedLocation, setSelectedLocation, fetchLocations } =
    useAppStore()

  const {
    data: locations,
    error,
    isLoading,
  } = useSWR('/api/locations', fetchLocations)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!locations) return <div>No locations found, please refresh the page.</div>

  return (
    <div>
      <h2>Select a Location</h2>
      <ListGroup>
        {locations.map((location) => (
          <ListGroup.Item
            key={location.id}
            action
            onClick={() => setSelectedLocation(location)}
            active={selectedLocation?.id === location.id}
          >
            {location.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default LocationList
