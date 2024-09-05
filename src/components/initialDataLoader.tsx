import React, { useEffect } from 'react'
import { useAppStore } from '../store/store'

interface InitialDataLoaderProps {
  children: React.ReactNode
}

const InitialDataLoader: React.FC<InitialDataLoaderProps> = ({ children }) => {
  const { fetchLocations, fetchServices, fetchProviders, error } = useAppStore()

  useEffect(() => {
    const loadInitialData = async () => {
      //await Promise.all([fetchProviders()])
    }

    loadInitialData()
  }, [fetchLocations, fetchServices, fetchProviders])

  if (error) {
    return <div>Error: {error}</div>
  }

  return <>{children}</>
}

export default InitialDataLoader
