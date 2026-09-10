"use client"

import { useState, useRef, useEffect } from "react"

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
}

export function CustomDropdown({ value, onChange, options, placeholder = "Select", required }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && optionsRef.current) {
      const highlighted = optionsRef.current.querySelector("[data-highlighted]")
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" })
      }
    }
  }, [isOpen, highlightedIndex])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault()
        setIsOpen(true)
        setHighlightedIndex(value ? options.indexOf(value) : 0)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % options.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex])
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const displayText = value || placeholder
  const hasValue = !!value

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Hidden native select for form validation */}
      {required && (
        <select
          required
          value={value}
          onChange={() => {}}
          tabIndex={-1}
          className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer pointer-events-none"
          aria-hidden="true"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setHighlightedIndex(value ? options.indexOf(value) : 0) }}
        className={`w-full min-h-[48px] flex items-center justify-between px-5 pr-[50px] bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] cursor-pointer text-left ${
          isOpen
            ? "border-[var(--gold-accent)] bg-[rgba(13,13,13,0.95)] shadow-[0_0_0_5px_rgba(221,186,94,0.2)] -translate-y-[3px]"
            : ""
        } ${hasValue ? "text-white font-medium" : "text-white/50 italic"}`}
      >
        <span>{displayText}</span>
        <svg
          className={`absolute right-5 w-5 h-5 text-[var(--gold-accent)] pointer-events-none transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Options */}
      {isOpen && (
        <div
          ref={optionsRef}
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-gradient-to-br from-[rgba(26,26,26,0.98)] to-[rgba(13,13,13,0.98)] backdrop-blur-[20px] border-2 border-[var(--gold-accent)] rounded-[15px] shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(221,186,94,0.1)] max-h-[300px] overflow-y-auto z-[1000] p-2 animate-[dropdownOpen_0.3s_cubic-bezier(0.4,0,0.2,1)]"
        >
          {options.map((option, i) => {
            const isSelected = option === value
            const isHighlighted = i === highlightedIndex
            return (
              <button
                key={option}
                type="button"
                data-highlighted={isHighlighted ? "" : undefined}
                onClick={() => { onChange(option); setIsOpen(false) }}
                onMouseEnter={() => setHighlightedIndex(i)}
                className={`w-full text-left px-5 py-3 text-white text-[0.95rem] cursor-pointer transition-all duration-300 border-l-[3px] border-l-transparent rounded-lg ${
                  isSelected
                    ? "bg-[rgba(221,186,94,0.15)] border-l-[var(--gold-accent)] text-[var(--gold-accent)] font-medium pl-[30px]"
                    : isHighlighted
                      ? "bg-[rgba(221,186,94,0.1)] border-l-[var(--gold-accent)] text-[var(--gold-accent)] pl-[30px]"
                      : "hover:bg-[rgba(221,186,94,0.1)] hover:border-l-[var(--gold-accent)] hover:text-[var(--gold-accent)] hover:pl-[30px]"
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownOpen {
          from { opacity: 0; transform: translateY(-15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
