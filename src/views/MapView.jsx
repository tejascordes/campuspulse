import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { Search, Layers, Loader2 } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../App.jsx'
import BottomSheet from '../components/BottomSheet.jsx'

// Fix Leaflet default icon in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Dark tile layer URL
const DARK_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const CATEGORIES = ['Society Hub', 'Recreational', 'Academic', 'Food']

function PinMarker({ pin, isSelected, onClick }) {
  return (
    <>
      {/* Outer subtle ring */}
      <CircleMarker
        center={[pin.latitude, pin.longitude]}
        radius={isSelected ? 18 : 12}
        pathOptions={{
          color: isSelected ? '#38bdf8' : '#71717a',
          fillColor: isSelected ? '#38bdf8' : '#71717a',
          fillOpacity: isSelected ? 0.2 : 0.08,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.9 : 0.4,
        }}
        eventHandlers={{ click: () => onClick(pin) }}
      />
      {/* Inner dot */}
      <CircleMarker
        center={[pin.latitude, pin.longitude]}
        radius={isSelected ? 7 : 5}
        pathOptions={{
          color: '#ffffff',
          fillColor: isSelected ? '#38bdf8' : '#141417',
          fillOpacity: 1,
          weight: 2,
          opacity: 1,
        }}
        eventHandlers={{ click: () => onClick(pin) }}
      />
    </>
  )
}

export default function MapView({ token }) {
  const [pins, setPins] = useState([])
  const [selectedPin, setSelectedPin] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${API_URL}/api/map/pins`)
      .then((res) => setPins(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredPins = pins.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePinClick = (pin) => setSelectedPin(pin)
  const handleCloseSheet = () => setSelectedPin(null)

  return (
    <div className="h-full relative" style={{ backgroundColor: '#0a0a0c' }}>
      {/* Search overlay */}
      <div className="absolute top-10 left-4 right-4 z-30">
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{
            backgroundColor: '#141417',
            border: '1px solid #232326',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <Search size={15} className="text-zinc-500 flex-shrink-0" />
          <input
            className="bg-transparent flex-1 text-xs outline-none text-zinc-100 placeholder:text-zinc-500"
            placeholder="Search campus buildings, hubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Legend */}
      <div className="absolute top-24 left-4 z-30 flex flex-col gap-1.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-medium"
            style={{
              backgroundColor: '#141417',
              border: '1px solid #232326',
              color: '#a1a1aa',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {/* Leaflet Map */}
      {!loading && (
        <MapContainer
          center={[30.3562, 76.3648]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={DARK_TILE}
          />
          {filteredPins.map((pin) => (
            <PinMarker
              key={pin.id}
              pin={pin}
              isSelected={selectedPin?.id === pin.id}
              onClick={handlePinClick}
            />
          ))}
        </MapContainer>
      )}

      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#0a0a0c' }}
        >
          <div className="text-center">
            <Loader2 size={24} className="animate-spin text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Loading campus map...</p>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{ display: selectedPin ? 'block' : 'none' }}
        >
          <BottomSheet pin={selectedPin} onClose={handleCloseSheet} />
        </div>
      </div>
    </div>
  )
}
