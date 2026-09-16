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
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        style={{ position: 'absolute', inset: 0, zIndex: 30, backgroundColor: 'rgba(0,0,0,0.4)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          maxHeight: '70vh',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.16)',
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
        {/* Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div className="drag-handle" />
        </div>

        <div style={{ padding: '0 20px 32px', overflowY: 'auto', maxHeight: 'calc(70vh - 28px)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              {/* Category chip */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: '#F7F7F7',
                  color: '#767676',
                  border: '1px solid #EBEBEB',
                  marginBottom: 8,
                }}
              >
                {pin.category}
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#222222', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {pin.name}
              </h2>
              {pin.distance_metric && (
                <p style={{ fontSize: 12, color: '#B0B0B0', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} />
                  <span>{pin.distance_metric}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#F7F7F7',
                border: '1px solid #EBEBEB',
                color: '#484848',
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Star Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: '9999px',
                backgroundColor: '#FFF8ED',
                border: '1px solid #FFE8C0',
              }}
            >
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#222222' }}>{pin.rating}</span>
            </div>
            <span style={{ fontSize: 12, color: '#B0B0B0' }}>Student verified rating</span>
          </div>

          {/* Description */}
          {pin.description && (
            <p style={{ fontSize: 14, color: '#484848', lineHeight: 1.6, marginBottom: 20 }}>
              {pin.description}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleDirections}
              className="btn-primary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '13px 16px',
                fontSize: 13,
              }}
            >
              <Navigation size={15} />
              <span>Get Directions</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{
                padding: '13px 18px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
