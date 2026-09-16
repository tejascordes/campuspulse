import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MessageSquare,
  ChevronUp,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
} from 'lucide-react'
import { postsApi } from '../api.js'
import SocietyFlairBadge from './SocietyFlairBadge.jsx'
import { getBadgeClass } from './PostCard.jsx'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function PostDiscussionModal({ post, user, isOpen, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvotedComments, setUpvotedComments] = useState({})

  const loadComments = useCallback(async () => {
    if (!post?.id) return
    setLoading(true)
    try {
      const data = await postsApi.getComments(post.id)
      setComments(data || [])
    } catch (e) {
      console.error('Failed to load post comments:', e)
    } finally {
      setLoading(false)
    }
  }, [post?.id])

  useEffect(() => {
    if (isOpen && post?.id) {
      loadComments()
    }
  }, [isOpen, post?.id, loadComments])

  const handleSendComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return
    setSubmitting(true)
    try {
      const activeFlair = user?.flair?.is_active !== false ? user?.flair : null
      const created = await postsApi.addComment(post.id, {
        content: newComment.trim(),
        author_name: user?.name || user?.email?.split('@')[0] || 'Campus Student',
        author_email: user?.email || 'student@thapar.edu',
        author_flair: activeFlair,
      })
      setComments((prev) => [...prev, created])
      setNewComment('')
      if (onCommentAdded) onCommentAdded(post.id)
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvoteComment = async (commentId) => {
    if (upvotedComments[commentId]) return
    setUpvotedComments((p) => ({ ...p, [commentId]: true }))
    try {
      await postsApi.upvoteComment(commentId)
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c))
      )
    } catch {
      // optimistic
    }
  }

  if (!isOpen || !post) return null

  const tags = Array.isArray(post.categories) && post.categories.length > 0
    ? post.categories
    : (post.category ? [post.category] : ['Tech'])

  const userActiveFlair = user?.flair?.is_active !== false ? user?.flair : null

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} className="md:items-center">
        {/* Backdrop */}
        <motion.div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 110,
            width: '100%',
            maxWidth: 620,
            backgroundColor: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
            border: '1px solid #DDDDDD',
          }}
          className="md:rounded-2xl md:max-h-[85vh]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        >
          {/* Top Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #DDDDDD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '9999px',
                  backgroundColor: '#FFF5F5',
                  color: '#FF385C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#222222', margin: 0 }}>
                  Campus Discussion
                </h3>
                <p style={{ fontSize: 11, color: '#717171', margin: '2px 0 0' }}>
                  {post.society_name} · {comments.length} comments
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '9999px',
                border: '1px solid #DDDDDD',
                backgroundColor: '#FFFFFF',
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Post & Discussion Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
            {/* Post Summary Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: 16,
                backgroundColor: '#F7F7F7',
                border: '1px solid #DDDDDD',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#222222' }}>
                    {post.society_name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '1px 5px',
                      borderRadius: 4,
                      backgroundColor: '#EDFAF4',
                      color: '#10B981',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <ShieldCheck size={10} /> Verified
                  </span>
                  <span style={{ fontSize: 11, color: '#717171' }}>·</span>
                  <span style={{ fontSize: 11, color: '#717171' }}>{timeAgo(post.created_at)}</span>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  {tags.map((t) => (
                    <span key={t} className={getBadgeClass(t)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#222222', margin: '0 0 6px', lineHeight: 1.3 }}>
                {post.title}
              </h4>
              <p style={{ fontSize: 12.5, color: '#555555', margin: 0, lineHeight: 1.5 }}>
                {post.description}
              </p>
            </div>

            {/* Comments Stream Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Replies &amp; Discussion
              </span>
              <span style={{ fontSize: 11, color: '#717171' }}>
                Reddit-style Society Flairs Active
              </span>
            </div>

            {/* Comments List */}
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8 }}>
                <Loader2 size={18} className="animate-spin" style={{ color: '#FF385C' }} />
                <span style={{ fontSize: 12, color: '#717171' }}>Loading discussion thread...</span>
              </div>
            ) : comments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 16px',
                  borderRadius: 12,
                  border: '1px dashed #DDDDDD',
                  backgroundColor: '#FAFAFA',
                  color: '#717171',
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, color: '#222222', margin: '0 0 4px' }}>
                  No replies yet
                </p>
                <p style={{ fontSize: 11, margin: 0 }}>
                  Be the first to share your thoughts or ask a question!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {comments.map((c) => {
                  const initial = (c.author_name || 'U').charAt(0).toUpperCase()
                  const isUpvoted = upvotedComments[c.id]
                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 14,
                        border: '1px solid #DDDDDD',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '9999px',
                          backgroundColor: '#F7F7F7',
                          border: '1px solid #DDDDDD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#222222',
                          flexShrink: 0,
                        }}
                      >
                        {initial}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#222222' }}>
                            {c.author_name}
                          </span>

                          {/* Reddit-style User Flair Badge */}
                          {c.author_flair && (
                            <SocietyFlairBadge flair={c.author_flair} size="sm" />
                          )}

                          <span style={{ fontSize: 11, color: '#717171' }}>·</span>
                          <span style={{ fontSize: 11, color: '#717171' }}>
                            {timeAgo(c.created_at)}
                          </span>
                        </div>

                        <p style={{ fontSize: 13, color: '#333333', margin: '0 0 8px', lineHeight: 1.45, wordBreak: 'break-word' }}>
                          {c.content}
                        </p>

                        {/* Comment Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <button
                            onClick={() => handleUpvoteComment(c.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: 11,
                              fontWeight: 700,
                              color: isUpvoted ? '#FF385C' : '#717171',
                            }}
                          >
                            <ChevronUp size={13} strokeWidth={isUpvoted ? 2.5 : 2} />
                            <span>{c.upvotes || 1}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom Comment Input Form */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #DDDDDD',
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* User Flair Indicator above input */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#717171' }}>
                <span>Replying as <strong>{user?.name || 'You'}</strong></span>
                {userActiveFlair ? (
                  <SocietyFlairBadge flair={userActiveFlair} size="sm" />
                ) : (
                  <span style={{ fontSize: 10, color: '#999999' }}>(No flair set)</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSendComment} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="input-standard"
                style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                placeholder="Write a comment or reply to this post..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: !newComment.trim() || submitting ? 'default' : 'pointer',
                  opacity: !newComment.trim() || submitting ? 0.6 : 1,
                }}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
