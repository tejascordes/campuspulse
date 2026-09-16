import { useState } from 'react'
import { ChevronUp, MessageSquare } from 'lucide-react'
import { postsApi } from '../api.js'
import PostDiscussionModal from './PostDiscussionModal.jsx'

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

/** Maps a category tag to a badge class */
export function getBadgeClass(tag = '') {
  const c = tag.toLowerCase()
  if (c.includes('tech') && !c.includes('non')) return 'category-badge category-badge-tech'
  if (c.includes('non')) return 'category-badge category-badge-nontech'
  if (c.includes('hack')) return 'category-badge category-badge-hackathon'
  if (c.includes('prize')) return 'category-badge category-badge-prizes'
  if (c.includes('cert')) return 'category-badge category-badge-certificate'
  if (c.includes('refresh')) return 'category-badge category-badge-refreshments'
  if (c.includes('overnight')) return 'category-badge category-badge-overnight'
  if (c.includes('cultur')) return 'category-badge category-badge-cultural'
  if (c.includes('work')) return 'category-badge category-badge-workshop'
  if (c.includes('free')) return 'category-badge category-badge-free'
  return 'category-badge category-badge-default'
}

export default function PostCard({ post, user }) {
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [voted, setVoted] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const [showDiscussion, setShowDiscussion] = useState(false)
  const [commentCount, setCommentCount] = useState(post.comment_count ?? 0)

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
  const primaryCategory = Array.isArray(post.categories) && post.categories.length > 0 ? post.categories[0] : (post.category || 'Tech')
  const heroClass = getHeroClass(primaryCategory)

  // Normalize all category tags
  const tags = Array.isArray(post.categories) && post.categories.length > 0
    ? post.categories
    : (post.category ? [post.category] : ['Tech'])

  return (
    <>
      <div
        onClick={() => setShowDiscussion(true)}
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
          {/* Society avatar or uploaded logo overlaid on banner */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              color: '#FF385C',
              flexShrink: 0,
              position: 'absolute',
              bottom: -18,
              left: 14,
              boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            {post.logo_url ? (
              <img
                src={post.logo_url}
                alt={post.society_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <span>{societyInitial}</span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '24px 14px 14px', backgroundColor: '#FFFFFF' }}>
          {/* Header: Society + time + category badge(s) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#222222' }}>
                {post.society_name}
              </span>
              <span style={{ fontSize: 11, color: '#717171' }}>·</span>
              <span style={{ fontSize: 11, color: '#717171' }}>
                {timeAgo(post.created_at)}
              </span>
            </div>

            {/* Multiple Tag Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <span key={tag} className={getBadgeClass(tag)}>
                  {tag}
                </span>
              ))}
            </div>
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowDiscussion(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: '#717171',
                fontSize: 13,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 8,
              }}
            >
              <MessageSquare size={14} />
              <span>{commentCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post Discussion Modal with Reddit-style user flairs */}
      <PostDiscussionModal
        post={post}
        user={user}
        isOpen={showDiscussion}
        onClose={() => setShowDiscussion(false)}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </>
  )
}
