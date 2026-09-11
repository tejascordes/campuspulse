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

// CARTO Basemap API Configuration
const apiKey = import.meta.env.VITE_CARTO_API_KEY
const tileUrl = apiKey && apiKey !== 'your_carto_api_key_here'
  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${apiKey}`
  : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

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
          fillColor: isSelected ? '#38bdf8' : '#121215',
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
    <div className="h-full w-full bg-[#09090b] flex flex-col overflow-hidden">
      <div className="flex-1 max-w-xl mx-auto md:max-w-4xl w-full h-full md:grid md:grid-cols-12 md:gap-4 md:py-4 md:px-2 relative">
        {/* Left Column on Desktop / Full on Mobile: Map Container */}
        <div className="h-full relative md:col-span-8 rounded-none md:rounded-2xl overflow-hidden md:border md:border-[#27272a] bg-[#09090b]">
          {/* Mobile Search overlay */}
          <div className="absolute top-6 left-4 right-4 z-30 md:hidden">
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] shadow-lg"
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

          {/* Category Legend (Mobile floating) */}
          <div className="absolute top-20 left-4 z-30 flex flex-col gap-1.5 md:hidden">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#121215] border border-[#27272a] text-zinc-400"
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
                url={tileUrl}
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
              className="absolute inset-0 flex items-center justify-center bg-[#09090b]"
            >
              <div className="text-center">
                <Loader2 size={24} className="animate-spin text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Loading campus map...</p>
              </div>
            </div>
          )}

          {/* Mobile Bottom Sheet */}
          <div className="absolute inset-0 z-20 pointer-events-none md:hidden">
            <div
              className="absolute inset-0 pointer-events-auto"
              style={{ display: selectedPin ? 'block' : 'none' }}
            >
              <BottomSheet pin={selectedPin} onClose={handleCloseSheet} />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Column: Interactive Location Directory */}
        <div className="hidden md:flex md:col-span-4 flex-col gap-3.5 h-full overflow-hidden">
          {/* Desktop Search */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#27272a]">
            <Search size={15} className="text-zinc-500 flex-shrink-0" />
            <input
              className="bg-transparent flex-1 text-xs outline-none text-zinc-100 placeholder:text-zinc-500"
              placeholder="Search campus buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchQuery(searchQuery === cat ? '' : cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  searchQuery === cat
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                    : 'bg-[#121215] text-zinc-400 border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pins List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id
              return (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#18181b] border-sky-500/60 shadow-md'
                      : 'bg-[#121215] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-zinc-400">{pin.category}</span>
                    <span className="text-[11px] font-semibold text-amber-400">★ {pin.rating}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{pin.name}</h4>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">{pin.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
