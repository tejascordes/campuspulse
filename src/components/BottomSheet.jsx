import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Navigation, X, MapPin, Share2 } from 'lucide-react'

export default function BottomSheet({ pin, onClose }) {
  if (!pin) return null

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pin.latitude},${pin.longitude}`
    window.open(url, '_blank')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pin.name,
        text: `Check out ${pin.name} on CampusPulse!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${pin.name} - ${pin.latitude},${pin.longitude}`)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="absolute inset-0 z-30"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        key="sheet"
        className="absolute bottom-0 left-0 right-0 z-40 rounded-t-2xl overflow-hidden"
        style={{
          backgroundColor: '#141417',
          border: '1px solid #232326',
          borderBottom: 'none',
          maxHeight: '70vh',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120) onClose()
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="drag-handle" />
        </div>

        <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 24px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3.5">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    border: '1px solid #232326',
                    color: '#a1a1aa',
                    backgroundColor: 'transparent',
                  }}
                >
                  {pin.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight truncate">
                {pin.name}
              </h2>
              {pin.distance_metric && (
                <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-zinc-500" />
                  <span>{pin.distance_metric}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ backgroundColor: '#1a1a1f', border: '1px solid #232326' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3.5">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: '#1a1a1f',
                border: '1px solid #232326',
                color: '#f4f4f5',
              }}
            >
              <Star size={13} fill="#eab308" color="#eab308" />
              <span>{pin.rating}</span>
            </div>
            <span className="text-xs text-zinc-500">Student verified rating</span>
          </div>

          {/* Description */}
          {pin.description && (
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              {pin.description}
            </p>
          )}

          {/* Actions: Standard Primary & Secondary Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleDirections}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary px-4 py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
