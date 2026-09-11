import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function PostCard({ post, onUpvote }) {
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

  return (
    <div
      className="p-4 mb-3 rounded-xl transition-colors cursor-pointer"
      style={{
        backgroundColor: '#141417',
        border: '1px solid #232326',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#323238')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#232326')}
    >
      {/* Header: Society, Author, Time & Neutral Category Chip */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{
              backgroundColor: '#1a1a1f',
              border: '1px solid #232326',
              color: '#d4d4d8',
            }}
          >
            {societyInitial}
          </div>
          <div className="min-w-0 truncate">
            <span className="text-xs font-semibold text-zinc-200 mr-2">
              {post.society_name}
            </span>
            <span className="text-[11px] text-zinc-500">
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>

        {/* Neutral Outline Category Chip */}
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 whitespace-nowrap"
          style={{
            border: '1px solid #232326',
            color: '#a1a1aa',
            backgroundColor: 'transparent',
          }}
        >
          {post.category}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-semibold text-zinc-100 leading-snug mb-1.5">
        {post.title}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3.5">
        {post.description}
      </p>

      {/* Footer Actions: Upvote & Comments */}
      <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid #1b1b1e' }}>
        <button
          onClick={handleUpvote}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: voted ? '#f4f4f5' : '#1a1a1f',
            color: voted ? '#0a0a0c' : '#a1a1aa',
            border: `1px solid ${voted ? '#f4f4f5' : '#232326'}`,
          }}
        >
          <ChevronUp size={14} strokeWidth={voted ? 2.5 : 2} />
          <span>{upvotes}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <MessageSquare size={13} />
            <span>{post.comment_count ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

