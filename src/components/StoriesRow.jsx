import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../App.jsx'

export default function StoriesRow({ onSocietyClick }) {
  const [societies, setSocieties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSocieties() {
      try {
        const res = await axios.get(`${API_URL}/api/societies`)
        setSocieties(res.data)
      } catch (e) {
        console.error('Failed to load societies for stories:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchSocieties()
  }, [])

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center gap-3 select-none">
      {/* Today / Highlights Bubble */}
      <button
        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer bg-transparent border-none p-0 group"
        onClick={() => onSocietyClick?.('CCS')}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#141417] border border-[#232326] group-hover:border-zinc-600 transition-colors">
            <Flame size={18} className="text-zinc-300 group-hover:text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0a0a0c]" />
        </div>
        <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
          Today
        </span>
      </button>

      {/* Society Story Bubbles */}
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-[#141417] border border-[#232326]" />
              <div className="w-8 h-2 rounded bg-[#141417]" />
            </div>
          ))
        : societies.map((soc) => {
            const hasEvents = soc.event_count > 0
            const initials = soc.name.slice(0, 2).toUpperCase()
            return (
              <button
                key={soc.name}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer bg-transparent border-none p-0 group"
                onClick={() => onSocietyClick?.(soc.name)}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs tracking-wider transition-colors ${
                      hasEvents
                        ? 'bg-[#141417] border border-zinc-500 text-zinc-100 group-hover:border-zinc-300'
                        : 'bg-[#141417] border border-[#232326] text-zinc-400 group-hover:border-zinc-600 group-hover:text-zinc-200'
                    }`}
                  >
                    {initials}
                  </div>
                  {hasEvents && (
                    <span className="absolute -top-0.5 -right-0.5 px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center text-[9px] font-bold bg-zinc-100 text-zinc-950 border border-[#0a0a0c]">
                      {soc.event_count}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium max-w-[56px] truncate text-center text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {soc.name}
                </span>
              </button>
            )
          })}
    </div>
  )
}

