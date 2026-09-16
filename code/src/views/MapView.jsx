import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, Loader2 } from 'lucide-react'
import { mapApi } from '../api.js'
import BottomSheet from '../components/BottomSheet.jsx'

// Fix Leaflet default icon in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Dark tile layer with CARTO API Key to remove watermark
const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || 'cb1_3gif_1_36cb4736549ba6b2eb8d936b'
const DARK_TILE = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`

const CATEGORIES = ['Society Hub', 'Recreational', 'Academic', 'Food']

function PinMarker({ pin, isSelected, onClick }) {
  return (
    <>
      {/* Outer halo */}
      <CircleMarker
        center={[pin.latitude, pin.longitude]}
        radius={isSelected ? 20 : 13}
        pathOptions={{
          color: isSelected ? '#FF385C' : '#FFFFFF',
          fillColor: isSelected ? '#FF385C' : '#FFFFFF',
          fillOpacity: isSelected ? 0.18 : 0.1,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.85 : 0.4,
        }}
        eventHandlers={{ click: () => onClick(pin) }}
      />
      {/* Inner dot */}
      <CircleMarker
        center={[pin.latitude, pin.longitude]}
        radius={isSelected ? 8 : 5}
        pathOptions={{
          color: '#FFFFFF',
          fillColor: isSelected ? '#FF385C' : '#FFFFFF',
          fillOpacity: 1,
          weight: 2,
          opacity: 1,
        }}
        eventHandlers={{ click: () => onClick(pin) }}
      />
    </>
  )
}

export default function MapView({ token: _token }) {
  const [pins, setPins] = useState([])
  const [selectedPin, setSelectedPin] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mapApi
      .getPins()
      .then((data) => setPins(data))
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
    <div className="h-full w-full flex flex-col overflow-hidden bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <div
        style={{
          flex: 1,
          maxWidth: '56rem',
          margin: '0 auto',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
        className="md:grid md:grid-cols-12 md:gap-4 md:py-4 md:px-2"
      >
        {/* Map Container */}
        <div
          className="md:col-span-8 md:rounded-2xl md:border"
          style={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderColor: '#DDDDDD',
          }}
        >
          {/* Mobile floating search pill */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 12,
              right: 12,
              zIndex: 30,
            }}
            className="md:hidden"
          >
            <div className="search-pill" style={{ pointerEvents: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '9999px',
                  backgroundColor: '#FF385C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Search size={14} style={{ color: '#FFFFFF' }} />
              </div>
              <input
                style={{
                  background: 'transparent',
                  flex: 1,
                  outline: 'none',
                  fontSize: 13,
                  color: '#222222',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                }}
                placeholder="Search campus buildings, hubs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile category legend (floating) */}
          <div
            className="md:hidden"
            style={{
              position: 'absolute',
              top: 74,
              left: 12,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDDDDD',
                  color: '#222222',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '9999px', backgroundColor: '#FF385C' }} />
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
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Loader2 size={24} className="animate-spin" style={{ color: '#FF385C', margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, color: '#717171' }}>Loading campus map…</p>
              </div>
            </div>
          )}

          {/* Mobile Bottom Sheet */}
          <div
            className="md:hidden"
            style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
          >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', display: selectedPin ? 'block' : 'none' }}>
              <BottomSheet pin={selectedPin} onClose={handleCloseSheet} />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          className="hidden md:flex md:col-span-4 flex-col gap-3"
          style={{ height: '100%', overflow: 'hidden' }}
        >
          {/* Desktop search pill */}
          <div className="search-pill" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD' }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '9999px',
                backgroundColor: '#FF385C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Search size={14} style={{ color: '#FFFFFF' }} />
            </div>
            <input
              style={{
                background: 'transparent',
                flex: 1,
                outline: 'none',
                fontSize: 13,
                color: '#222222',
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
              placeholder="Search campus buildings…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop category filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map((cat) => {
              const isActive = searchQuery === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSearchQuery(searchQuery === cat ? '' : cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: 12,
                    fontWeight: 600,
                    border: isActive ? 'none' : '1px solid #DDDDDD',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: isActive ? '#000000' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#222222',
                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.14)' : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Location cards */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id
              return (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: isSelected ? '#FFF5F5' : '#FFFFFF',
                    border: isSelected ? '1.5px solid #FF385C' : '1px solid #DDDDDD',
                    boxShadow: isSelected ? '0 2px 12px rgba(255,56,92,0.14)' : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {pin.category}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>★ {pin.rating}</span>
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#222222', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pin.name}
                  </h4>
                  <p style={{ fontSize: 11, color: '#717171', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pin.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
