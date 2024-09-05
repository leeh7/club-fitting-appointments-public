import React from 'react'
import HomePage from '../components/homePage'
import InitialDataFetcher from './initialDataFetcher'

export default function Home() {
  return (
    <InitialDataFetcher>
      <HomePage />
    </InitialDataFetcher>
  )
}
