'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { BorderBeam } from '@/components/ui/border-beam'
import { Component as GeneratingLoader } from '@/components/ui/quantum-pulse-loade'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import { useLocale } from '@/lib/i18n'
import type { Thumbnail } from '@/lib/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_ATTACHMENTS = 10

interface Attachment {
  id: string
  url: string        // object URL (local file) or image_url (existing thumbnail)
  file?: File        // present for local uploads
  name: string
}

interface PromptAreaProps {
  onOpenPricing?: () => void
}

export default function PromptArea({ onOpenPricing }: PromptAreaProps) {
  const { user } = useAuth()
  const { t } = useLocale()
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<Thumbnail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [existingThumbnails, setExistingThumbnails] = useState<Thumbnail[]>([])
  const [showExistingPopover, setShowExistingPopover] = useState(false)
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const existingBtnRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])

  // Fetch user's existing thumbnails for the popover
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const { data } = await supabase
        .from('thumbnails')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!cancelled && data) {
        setExistingThumbnails(data as Thumbnail[])
      }
    }

    load()
    return () => { cancelled = true }
  }, [user, supabase])

  // Close popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const inBtn = existingBtnRef.current?.contains(target)
      const inPopover = popoverRef.current?.contains(target)
      if (!inBtn && !inPopover) {
        setShowExistingPopover(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Calculate popover position from button
  const openPopover = useCallback(() => {
    if (existingBtnRef.current) {
      const rect = existingBtnRef.current.getBoundingClientRect()
      setPopoverPos({ x: rect.left, y: rect.top })
    }
    setShowExistingPopover(true)
  }, [])

  // Typewriter effect for placeholder
  useEffect(() => {
    const target = t.prompt.placeholders[placeholderIndex]
    let charIndex = 0

    if (isTyping) {
      intervalRef.current = setInterval(() => {
        charIndex++
        setDisplayedPlaceholder(target.slice(0, charIndex))
        if (charIndex >= target.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setTimeout(() => setIsTyping(false), 2000)
        }
      }, 40)
    } else {
      let remaining = target.length
      intervalRef.current = setInterval(() => {
        remaining--
        setDisplayedPlaceholder(target.slice(0, remaining))
        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setPlaceholderIndex((i) => (i + 1) % t.prompt.placeholders.length)
          setIsTyping(true)
        }
      }, 25)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [placeholderIndex, isTyping, t])

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArr = Array.from(files)
    const errors: string[] = []

    const validFiles = fileArr.filter((f) => {
      if (!f.type.startsWith('image/')) {
        errors.push(`${f.name}: ${t.prompt.notAnImage}`)
        return false
      }
      if (f.size > MAX_FILE_SIZE) {
        errors.push(`${f.name}: ${t.prompt.exceeds5MB}`)
        return false
      }
      return true
    })

    setAttachments((prev) => {
      const remaining = MAX_ATTACHMENTS - prev.length
      if (remaining <= 0) {
        errors.push(t.prompt.maxAttachments.replace('{n}', String(MAX_ATTACHMENTS)))
        return prev
      }
      const toAdd = validFiles.slice(0, remaining)
      return [
        ...prev,
        ...toAdd.map((f) => ({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(f),
          file: f,
          name: f.name,
        })),
      ]
    })

    if (errors.length > 0) {
      setError(errors.join('. '))
      setTimeout(() => setError(null), 4000)
    }
  }, [t])

  const attachExistingThumbnail = useCallback((thumb: Thumbnail) => {
    if (!thumb.image_url) return

    setAttachments((prev) => {
      if (prev.length >= MAX_ATTACHMENTS) return prev
      if (prev.some((a) => a.id === thumb.id)) return prev
      return [
        ...prev,
        {
          id: thumb.id,
          url: thumb.image_url!,
          name: thumb.prompt.slice(0, 30),
        },
      ]
    })
    setShowExistingPopover(false)
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id)
      if (removed?.file) URL.revokeObjectURL(removed.url)
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!value.trim() || isGenerating) return

      setIsGenerating(true)
      setError(null)
      setResult(null)

      try {
        // Build request body
        const images: { data: string; mimeType: string }[] = []

        for (const att of attachments) {
          if (att.file) {
            // Local file → base64
            const buffer = await att.file.arrayBuffer()
            const base64 = btoa(
              new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), '')
            )
            images.push({ data: base64, mimeType: att.file.type })
          } else {
            // Existing thumbnail URL → fetch and convert
            const res = await fetch(att.url)
            const blob = await res.blob()
            const buffer = await blob.arrayBuffer()
            const base64 = btoa(
              new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), '')
            )
            images.push({ data: base64, mimeType: blob.type || 'image/png' })
          }
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 200_000)

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: value.trim(),
            ...(images.length > 0 && { images }),
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 402) {
            onOpenPricing?.()
            return
          }
          throw new Error(data.error || 'Generation failed')
        }

        setResult(data.thumbnail)
        setValue('')
        setAttachments([])
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } catch (err: unknown) {
        const message =
          err instanceof DOMException && err.name === 'AbortError'
            ? t.prompt.timedOut
            : err instanceof Error ? err.message : t.prompt.somethingWentWrong
        setError(message)
      } finally {
        setIsGenerating(false)
      }
    },
    [value, isGenerating, attachments, t, onOpenPricing]
  )

  const handleRetry = useCallback(() => {
    setError(null)
    setResult(null)
  }, [])

  const hasResult = result && result.image_url
  const hasError = !!error

  return (
    <div className="flex flex-col items-center justify-center px-6 w-full">
      {/* Title — only show when idle (no result/error/generating) */}
      {!hasResult && !hasError && !isGenerating && (
        <h2 className="mb-10 text-4xl font-bold font-handwriting text-foreground text-center leading-tight">
          {t.prompt.heading}
        </h2>
      )}

      {/* Generating loader — above the prompt */}
      {isGenerating && (
        <div className="mb-8 w-full max-w-2xl py-16 px-6">
          <GeneratingLoader />
        </div>
      )}

      {/* Result display — above the prompt */}
      {hasResult && (
        <div className="mb-8 w-full max-w-2xl">
          <div className="rounded-2xl overflow-hidden bg-foreground/[0.04] border border-foreground/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-video">
              <Image
                src={result.image_url!}
                alt={result.prompt}
                fill
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-foreground/50 text-sm truncate">{result.prompt}</p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href={result.image_url!}
                  download={`thumbnail-${result.id}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-foreground/10 text-foreground text-sm font-medium hover:bg-foreground/15 transition-colors"
                >
                  {t.prompt.download}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error display — above the prompt */}
      {hasError && !isGenerating && (
        <div className="mb-8 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-5 py-12 px-6 rounded-2xl bg-foreground/[0.04] border border-foreground/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-foreground text-lg font-semibold">{t.prompt.generationFailed}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-xl bg-foreground/10 border border-foreground/[0.08] text-foreground text-sm font-medium cursor-pointer transition-colors hover:bg-foreground/15"
            >
              {t.prompt.tryAgain}
            </button>
          </div>
        </div>
      )}

      {/* Prompt form */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-foreground/[0.06] border border-foreground/[0.1] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-200 focus-within:border-foreground/20 focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.15)] dark:focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.3)] focus-within:bg-foreground/[0.08]">
        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="flex gap-2 px-4 pt-4 pb-1 overflow-x-auto scrollbar-thin">
            {attachments.map((att) => (
              <div key={att.id} className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-foreground/[0.1] group/att">
                <Image
                  src={att.url}
                  alt={att.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized={!!att.file}
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  aria-label={t.prompt.removeAttachment}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white/80 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            <span className="self-center text-foreground/20 text-xs shrink-0">
              {attachments.length}/{MAX_ATTACHMENTS}
            </span>
          </div>
        )}

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            const el = e.target
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (value.trim() && !isGenerating) {
                textareaRef.current?.form?.requestSubmit()
              }
            }
          }}
          placeholder={displayedPlaceholder}
          disabled={isGenerating}
          rows={1}
          className="w-full px-6 pt-5 pb-3 bg-transparent text-foreground text-lg placeholder:text-foreground/25 outline-none disabled:opacity-50 resize-none overflow-hidden"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* Left: existing thumbnails + attachment + mic */}
          <div className="flex items-center gap-1">
            {/* Existing thumbnails button */}
            <button
              ref={existingBtnRef}
              type="button"
              disabled={isGenerating}
              onMouseEnter={openPopover}
              onClick={openPopover}
              title={t.prompt.myThumbnails}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground/35 cursor-pointer transition-colors hover:text-foreground/70 hover:bg-foreground/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {/* Grid/gallery icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>

            {/* Existing thumbnails popover — portaled to body to escape backdrop-blur containing block */}
            {showExistingPopover && existingThumbnails.length > 0 && popoverPos && createPortal(
              <div
                ref={popoverRef}
                style={{ left: popoverPos.x, top: popoverPos.y }}
                className="fixed -translate-y-full -mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-popover border border-border shadow-[0_8px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-3 scrollbar-thin z-[9999]"
                onMouseLeave={() => setShowExistingPopover(false)}
              >
                <p className="px-2 py-1.5 text-foreground/40 text-xs font-semibold uppercase tracking-wide">
                  {t.prompt.attachExisting}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {existingThumbnails.map((thumb) => (
                    <button
                      key={thumb.id}
                      type="button"
                      onClick={() => attachExistingThumbnail(thumb)}
                      disabled={attachments.some((a) => a.id === thumb.id)}
                      className="relative aspect-video rounded-lg overflow-hidden border border-foreground/[0.06] cursor-pointer transition-all hover:border-foreground/[0.2] hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {thumb.image_url && (
                        <Image
                          src={thumb.image_url}
                          alt={thumb.prompt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>,
              document.body,
            )}

            {/* File attachment button */}
            <button
              type="button"
              disabled={isGenerating || attachments.length >= MAX_ATTACHMENTS}
              onClick={() => fileInputRef.current?.click()}
              title={t.prompt.attachImages}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground/35 cursor-pointer transition-colors hover:text-foreground/70 hover:bg-foreground/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              aria-label={t.prompt.uploadImages}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files)
                e.target.value = ''
              }}
            />

            {/* Mic button */}
            <button
              type="button"
              disabled={isGenerating}
              title={t.prompt.voiceInput}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground/35 cursor-pointer transition-colors hover:text-foreground/70 hover:bg-foreground/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>

          {/* Right: submit button */}
          <button
            type="submit"
            disabled={isGenerating || !value.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-background/20 border-t-background/80 rounded-full animate-spin" />
                {t.prompt.generating}
              </>
            ) : (
              <>
                {t.prompt.generate}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </div>
        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-[#FFD700] to-transparent"
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          borderWidth={2}
          className="from-transparent via-[#C0C0C0] to-transparent"
        />
      </form>

      <p className="mt-4 text-foreground/30 text-sm">
        {t.prompt.helper}
      </p>
    </div>
  )
}
