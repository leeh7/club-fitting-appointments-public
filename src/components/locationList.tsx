import { ListGroup } from 'react-bootstrap';
import useSWR from 'swr';
import { useAppStore } from '../store/store';
import SearchBar from './searchBar';
import React, { useState, useEffect } from 'react';

function LocationList() {
  const { selectedLocation, setSelectedLocation, fetchLocations, setLocations, locations } =
    useAppStore();
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [query, setQuery] = useState('');

  const { data, error, isLoading } = useSWR('/api/locations', fetchLocations, {
    onSuccess: (data) => {
      if(data != null) {
        setLocations(data); // Update the store with fetched locations
        setFilteredLocations(data); // Initialize filtered locations with all fetched locations
      }
    },
  });

  useEffect(() => {
    if (query) {
      setFilteredLocations(
        locations.filter((location) =>
          location.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredLocations(locations);
    }
  }, [query, locations]);

  if (error) return <div>Failed to load locations</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!locations || locations.length === 0) return <div>No locations found, please refresh the page.</div>;

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <div>
      <h2>Select a Location</h2>

      <SearchBar onSearch={handleSearch} />

      <ListGroup>
        {filteredLocations.map((location) => (
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
  );
}

export default LocationList;
