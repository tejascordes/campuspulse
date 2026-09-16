import { useState } from 'react'
import { ChevronUp, MessageSquare } from 'lucide-react'
import { postsApi } from '../api.js'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/** Maps a category name to a CSS class for the hero gradient */
function getHeroClass(category = '') {
  const c = category.toLowerCase()
  if (c.includes('tech') && !c.includes('non')) return 'hero-gradient-tech'
  if (c.includes('non')) return 'hero-gradient-nontech'
  if (c.includes('hack')) return 'hero-gradient-hackathon'
  if (c.includes('prize')) return 'hero-gradient-prizes'
  if (c.includes('refresh')) return 'hero-gradient-refreshments'
  return 'hero-gradient-default'
}

/** Maps a category to a badge class */
function getBadgeClass(category = '') {
  const c = category.toLowerCase()
  if (c.includes('tech') && !c.includes('non')) return 'category-badge category-badge-tech'
  if (c.includes('non')) return 'category-badge category-badge-nontech'
  if (c.includes('hack')) return 'category-badge category-badge-hackathon'
  if (c.includes('prize')) return 'category-badge category-badge-prizes'
  if (c.includes('refresh')) return 'category-badge category-badge-refreshments'
  return 'category-badge category-badge-default'
}

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [voted, setVoted] = useState(false)
  const [upvoting, setUpvoting] = useState(false)

  const handleUpvote = async (e) => {
    e.stopPropagation()
    if (voted || upvoting) return
    setUpvoting(true)
    try {
      const data = await postsApi.upvotePost(post.id)
      setUpvotes(data.upvotes)
      setVoted(true)
    } catch {
      setUpvotes((u) => u + 1)
      setVoted(true)
    } finally {
      setUpvoting(false)
    }
  }

  const societyInitial = (post.society_name || 'C').charAt(0).toUpperCase()
  const heroClass = getHeroClass(post.category)
  const badgeClass = getBadgeClass(post.category)

  return (
    <div
      className="surface-card surface-card-hover"
      style={{
        marginBottom: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #DDDDDD',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Hero Banner — gradient photo stand-in */}
      <div
        className={heroClass}
        style={{
          height: 96,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '12px 14px',
          position: 'relative',
        }}
      >
        {/* Society avatar overlaid on banner */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '9999px',
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(6px)',
            border: '2px solid rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 800,
            color: '#FFFFFF',
            flexShrink: 0,
            position: 'absolute',
            bottom: -16,
            left: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          {societyInitial}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '24px 14px 14px', backgroundColor: '#FFFFFF' }}>
        {/* Header: Society + time + category badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#222222' }}>
              {post.society_name}
            </span>
            <span style={{ fontSize: 11, color: '#717171' }}>·</span>
            <span style={{ fontSize: 11, color: '#717171' }}>
              {timeAgo(post.created_at)}
            </span>
          </div>
          <span className={badgeClass}>{post.category}</span>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#222222', margin: '0 0 6px', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 13, color: '#717171', lineHeight: 1.55, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.description}
        </p>

        {/* Footer: Upvote & Comments */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid #DDDDDD',
          }}
        >
          <button
            onClick={handleUpvote}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: 13,
              fontWeight: 600,
              cursor: voted ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: voted ? '#FF385C' : '#FFFFFF',
              color: voted ? '#FFFFFF' : '#222222',
              border: voted ? 'none' : '1px solid #DDDDDD',
              boxShadow: voted ? '0 2px 8px rgba(255,56,92,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronUp size={14} strokeWidth={voted ? 2.5 : 2} />
            <span>{upvotes}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#717171', fontSize: 13 }}>
            <MessageSquare size={14} />
            <span>{post.comment_count ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
