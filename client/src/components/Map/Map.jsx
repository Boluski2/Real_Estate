"use client"
import React from 'react'
import { MapContainer, TileLayer } from "react-leaflet"
import GeoCorderMarker from '../GeoCorderMarker/GeoCoderMarker'

const Map = ({ address, city, country }) => {
  return (
    <MapContainer
    center={[53.35, 18.8]}
    zoom={1}
    scrollWheelZoom={false}
    style={{
        height: "40vh",
        width: "100%",
        margin: "20px",
        zIndex: 0,
    }}
    >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoCorderMarker address={`${address} ${city} ${country}`} />
    </MapContainer>
  )
}

export default Map
