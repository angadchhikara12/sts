"use client"

import * as React from "react"
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Period = "AM" | "PM"

interface TimePickerContextProps {
  setRef: (type: "hour" | "minute" | "period", element: HTMLInputElement | null) => void
  onUpChange?: (type: "hour" | "minute" | "period") => void
  onLeftChange?: (type: "hour" | "minute" | "period") => void
}

const TimePickerContext = React.createContext<TimePickerContextProps | null>(null)

function useTimePickerContext() {
  const context = React.useContext(TimePickerContext)
  if (!context) {
    throw new Error("TimePicker components must be used within <TimePicker>")
  }
  return context
}

interface TimePickerInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  onUpChange?: () => void
  onLeftChange?: () => void
  onChange?: (value: string | number) => void
  type?: "hour" | "minute" | "period"
  maxLength?: number
}

function TimePickerInput({
  className,
  type = "hour",
  maxLength = 2,
  placeholder = "__",
  onUpChange,
  onLeftChange,
  onChange,
  ...props
}: TimePickerInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showOverlay, setShowOverlay] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const { setRef } = useTimePickerContext()

  React.useEffect(() => {
    setRef(type, inputRef.current)
  }, [setRef, type])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      onUpChange?.()
    } else if (e.key === "ArrowLeft") {
      onLeftChange?.()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className="flex h-5 items-center justify-center"
        onClick={onUpChange}
      >
        <ChevronUpIcon className="size-3" />
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={cn(
          "flex size-10 items-center justify-center rounded-md border border-input bg-transparent text-center tabular-nums text-white/90 font-[arial]",
          isFocused && "border-[#DDBB5E] ring-1 ring-[#DDBB5E]",
          className
        )}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        {...props}
      />
      <button
        type="button"
        className="flex h-5 items-center justify-center"
        onClick={() => onLeftChange?.()}
      >
        <ChevronDownIcon className="size-3" />
      </button>
    </div>
  )
}

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  className?: string
}

function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>("AM")
  const hourRef = React.useRef<HTMLInputElement | null>(null)
  const minuteRef = React.useRef<HTMLInputElement | null>(null)
  const periodRef = React.useRef<HTMLInputElement | null>(null)

  const setRef = React.useCallback((type: "hour" | "minute" | "period", element: HTMLInputElement | null) => {
    if (type === "hour") hourRef.current = element
    else if (type === "minute") minuteRef.current = element
    else periodRef.current = element
  }, [])

  const minuteChange = (amount: number) => {
    if (!minuteRef.current) return
    const current = parseInt(minuteRef.current.value, 10) || 0
    const newValue = current + amount
    if (newValue > 59) minuteRef.current.value = "00"
    else if (newValue < 0) minuteRef.current.value = "59"
    else minuteRef.current.value = String(newValue).padStart(2, "0")
  }

  const hourChange = (amount: number) => {
    if (!hourRef.current) return
    const current = parseInt(hourRef.current.value, 10) || 0
    const newValue = current + amount
    if (newValue > 12) hourRef.current.value = "01"
    else if (newValue < 1) hourRef.current.value = "12"
    else hourRef.current.value = String(newValue).padStart(2, "0")
  }

  const periodChange = () => {
    setPeriod((prev) => (prev === "AM" ? "PM" : "AM"))
  }

  const emitChange = React.useCallback(() => {
    if (!hourRef.current || !minuteRef.current) return
    const h = hourRef.current.value.padStart(2, "0")
    const m = minuteRef.current.value.padStart(2, "0")
    onChange?.(`${h}:${m} ${period}`)
  }, [onChange, period])

  return (
    <TimePickerContext.Provider value={{ setRef }}>
      <div className={cn("flex items-center gap-1", className)}>
        <TimePickerInput
          type="hour"
          placeholder="__"
          maxLength={2}
          onUpChange={() => { hourChange(1); emitChange() }}
          onLeftChange={() => { hourChange(-1); emitChange() }}
          onChange={emitChange}
        />
        <span className="text-white/90 text-lg font-[arial]">:</span>
        <TimePickerInput
          type="minute"
          placeholder="__"
          maxLength={2}
          onUpChange={() => { minuteChange(1); emitChange() }}
          onLeftChange={() => { minuteChange(-1); emitChange() }}
          onChange={emitChange}
        />
        <TimePickerInput
          type="period"
          placeholder={period}
          maxLength={2}
          value={period}
          onUpChange={() => { periodChange(); emitChange() }}
          onLeftChange={() => { periodChange(); emitChange() }}
          onChange={emitChange}
        />
      </div>
    </TimePickerContext.Provider>
  )
}

export { TimePicker, TimePickerInput }
