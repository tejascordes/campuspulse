import { Crown, Shield, Users, Clock, CheckCircle2 } from 'lucide-react'

// Color map for known campus societies to make flair tags visually distinct like Reddit
const SOCIETY_COLORS = {
  ccs: { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3', dot: '#FF385C' },
  owasp: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', dot: '#10B981' },
  mudra: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', dot: '#8B5CF6' },
  trident: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', dot: '#3B82F6' },
  'e-cell': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', dot: '#10B981' },
  edc: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', dot: '#10B981' },
  aagaaz: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', dot: '#F59E0B' },
  rotaract: { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8', dot: '#EC4899' },
  'quiz club': { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE', dot: '#6366F1' },
  fap: { bg: '#F0FDFA', text: '#0D9488', border: '#99F6E4', dot: '#14B8A6' },
  acm: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#2563EB' },
}

function getColors(societyName = '', customColor = null) {
  const key = (societyName || '').trim().toLowerCase()
  if (SOCIETY_COLORS[key]) return SOCIETY_COLORS[key]
  if (customColor) {
    return { bg: '#F7F7F7', text: customColor, border: '#DDDDDD', dot: customColor }
  }
  return { bg: '#F4F4F5', text: '#3F3F46', border: '#E4E4E7', dot: '#71717A' }
}

function getTierShortLabel(tier) {
  const normalized = (tier || '').toUpperCase()
  if (normalized === 'EB') return 'EB'
  if (normalized === 'CORE') return 'Core'
  if (normalized === 'MEMBER') return 'Member'
  return null
}

export default function SocietyFlairBadge({
  flair,
  societyName: propSocName,
  role: propRole,
  logoUrl: propLogoUrl,
  size = 'sm',
  showStatus = false,
  className = '',
}) {
  const socName = flair?.society_name || propSocName
  const role = flair?.role || propRole
  const tier = flair?.tier || null
  const status = flair?.status || 'APPROVED'
  const logoUrl = flair?.logo_url || propLogoUrl

  if (!socName && !role) return null

  const colors = getColors(socName, flair?.badge_color)
  const isSmall = size === 'sm'
  const tierShort = getTierShortLabel(tier)
  const isPending = status === 'PENDING'

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium transition-all ${className}`}
      style={{
        fontSize: isSmall ? '10.5px' : '12px',
        lineHeight: 1,
        padding: isSmall ? '2px 7px 2px 5px' : '3px 9px 3px 7px',
        borderRadius: '9999px',
        backgroundColor: isPending && showStatus ? '#FFFBEB' : colors.bg,
        color: isPending && showStatus ? '#B45309' : colors.text,
        border: `1px solid ${isPending && showStatus ? '#FDE68A' : colors.border}`,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        verticalAlign: 'middle',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      title={`${socName}${tierShort ? ` · ${tierShort}` : ''}${role ? ` · ${role}` : ''} (${isPending ? 'Pending Approval' : 'Verified Society Flair'})`}
    >
      {/* Miniature logo or tier/colored indicator */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={socName}
          style={{
            width: isSmall ? 12 : 14,
            height: isSmall ? 12 : 14,
            borderRadius: '9999px',
            objectFit: 'cover',
            marginRight: 2,
          }}
        />
      ) : tier === 'EB' ? (
        <Crown size={isSmall ? 10 : 12} style={{ marginRight: 1, flexShrink: 0 }} />
      ) : tier === 'CORE' ? (
        <Shield size={isSmall ? 10 : 12} style={{ marginRight: 1, flexShrink: 0 }} />
      ) : (
        <span
          style={{
            width: isSmall ? 6 : 7,
            height: isSmall ? 6 : 7,
            borderRadius: '9999px',
            backgroundColor: isPending && showStatus ? '#F59E0B' : colors.dot,
            flexShrink: 0,
            marginRight: 2,
          }}
        />
      )}

      {/* Society Name */}
      <span>{socName}</span>

      {/* Hierarchy Tier Badge if distinct from role */}
      {tierShort && (!role || !role.toLowerCase().includes(tierShort.toLowerCase())) && (
        <>
          <span style={{ opacity: 0.45, margin: '0 1px', fontWeight: 400 }}>·</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: isSmall ? '9.5px' : '10.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {tierShort}
          </span>
        </>
      )}

      {/* Role Tag (if present) */}
      {role && (
        <>
          <span style={{ opacity: 0.5, margin: '0 1px', fontWeight: 400 }}>·</span>
          <span style={{ fontWeight: 600, opacity: 0.9 }}>{role}</span>
        </>
      )}

      {/* Optional Status Indicator */}
      {showStatus && (
        isPending ? (
          <Clock size={10} style={{ marginLeft: 2, color: '#D97706', flexShrink: 0 }} />
        ) : (
          <CheckCircle2 size={10} style={{ marginLeft: 2, opacity: 0.85, flexShrink: 0 }} />
        )
      )}
    </span>
  )
}
