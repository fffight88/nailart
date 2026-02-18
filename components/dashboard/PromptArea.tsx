'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BorderBeam } from '@/components/ui/border-beam'
import { Component as GeneratingLoader } from '@/components/ui/quantum-pulse-loade'
import type { Thumbnail } from '@/lib/types'

const PLACEHOLDERS = [
  'A cat wearing sunglasses on a neon background...',
  'Epic gaming moment with dramatic lighting...',
  'Minimalist tech review thumbnail...',
  'Before and after transformation split...',
  'Shocking reaction face with bold text...',
]

export default function PromptArea() {
  const [value, setValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<Thumbnail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Typewriter effect for placeholder
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIndex]
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
          setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
          setIsTyping(true)
        }
      }, 25)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [placeholderIndex, isTyping])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!value.trim() || isGenerating) return

      setIsGenerating(true)
      setError(null)
      setResult(null)

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: value.trim() }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Generation failed')
        }

        setResult(data.thumbnail)
        setValue('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
      } finally {
        setIsGenerating(false)
      }
    },
    [value, isGenerating]
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
        <h2 className="mb-10 text-4xl font-bold font-handwriting text-white text-center leading-tight">
          What thumbnail do you want to create?
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
          <div className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <img
              src={result.image_url!}
              alt={result.prompt}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <p className="text-white/50 text-sm truncate">{result.prompt}</p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href={result.image_url!}
                  download={`thumbnail-${result.id}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error display — above the prompt */}
      {hasError && (
        <div className="mb-8 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-5 py-12 px-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            {/* Red circle X icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold">Generation Failed</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/[0.08] text-white text-sm font-medium cursor-pointer transition-colors hover:bg-white/15"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Prompt form */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-200 focus-within:border-white/20 focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.3)] focus-within:bg-white/[0.08]">
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
          className="w-full px-6 pt-5 pb-3 bg-transparent text-white text-lg placeholder:text-white/25 outline-none disabled:opacity-50 resize-none overflow-hidden"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* Left: attachment + mic */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isGenerating}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/35 cursor-pointer transition-colors hover:text-white/70 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button
              type="button"
              disabled={isGenerating}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/35 cursor-pointer transition-colors hover:text-white/70 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#181818] text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#181818]/20 border-t-[#181818]/80 rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate
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

      <p className="mt-4 text-white/30 text-sm">
        Describe your thumbnail idea and let AI do the rest
      </p>
    </div>
  )
}
