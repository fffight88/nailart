'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import type { Thumbnail } from '@/lib/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function ThumbnailCard({ thumbnail }: { thumbnail: Thumbnail }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(thumbnail.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {thumbnail.image_url && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail.image_url}
            alt={thumbnail.prompt}
            fill
            sizes="264px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-3">
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
          {thumbnail.prompt}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-2 flex items-center gap-1.5 text-white/30 text-xs cursor-pointer transition-colors hover:text-white/60"
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('thumbnails')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!cancelled && !error && data) {
        setThumbnails(data as Thumbnail[])
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user, supabase])

  // Realtime subscription for new thumbnails
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('sidebar-thumbnails')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thumbnails',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as Thumbnail
            if (row.status === 'completed' && row.image_url) {
              setThumbnails((prev) => {
                const filtered = prev.filter((t) => t.id !== row.id)
                return [row, ...filtered]
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 pt-[64px] flex flex-col bg-[#202020] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-white/70 text-sm font-semibold tracking-wide uppercase">
            My Thumbnails
          </h3>
          <span className="text-white/30 text-xs">
            {thumbnails.length}
          </span>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : thumbnails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">No thumbnails yet</p>
              <p className="text-white/20 text-xs mt-1">Generate your first one!</p>
            </div>
          ) : (
            thumbnails.map((thumb) => (
              <ThumbnailCard key={thumb.id} thumbnail={thumb} />
            ))
          )}
        </div>

        {/* Glass right edge */}
        <div className="absolute top-0 right-0 w-px h-full bg-white/[0.06]" />
      </aside>
    </>
  )
}
