import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useEthiopianCalendar } from './useEthiopianCalendar'
import { getEthiopianMonthStartDay } from './utils'

type CalendarMode = 'ethiopian' | 'gregorian'

interface EthiopianCalendarProps {
  onDateSelect?: (date: { day: number; month: number; year: number }) => void
}

const GC_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_OF_WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Amharic days of the week, Sunday first
// Docs on why order matters: the Ethiopian week also starts on Sunday
const DAYS_OF_WEEK_AM = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']

export function EthiopianCalendar({ onDateSelect }: EthiopianCalendarProps) {
  const [mode, setMode] = useState<CalendarMode>('ethiopian')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const today = new Date()
  const [gcMonth, setGcMonth] = useState(today.getMonth())
  const [gcYear, setGcYear] = useState(today.getFullYear())

  const {
    currentMonth,
    currentYear,
    today: todayET,
    daysInCurrentMonth,
    monthName,
    monthAmharic,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  } = useEthiopianCalendar()

  const handleDayClick = (day: number) => {
    const newSelected = day === selectedDay ? null : day
    setSelectedDay(newSelected)
    if (newSelected) onDateSelect?.({ day, month: currentMonth, year: currentYear })
  }

  const etDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)

  // Get the weekday offset for the 1st of the current Ethiopian month
  // So the grid aligns correctly under the day headers, just like Gregorian
  const etMonthStartDay = getEthiopianMonthStartDay(currentMonth, currentYear)

  const daysInGcMonth = new Date(gcYear, gcMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(gcYear, gcMonth, 1).getDay()
  const gcDays = Array.from({ length: daysInGcMonth }, (_, i) => i + 1)

  const goToPrevGcMonth = () => {
    if (gcMonth === 0) { setGcMonth(11); setGcYear(y => y - 1) }
    else setGcMonth(m => m - 1)
  }

  const goToNextGcMonth = () => {
    if (gcMonth === 11) { setGcMonth(0); setGcYear(y => y + 1) }
    else setGcMonth(m => m + 1)
  }

  return (
    <div className="w-fit rounded-xl border bg-background p-4 shadow-sm">

      {/* Mode toggle */}
      <div className="mb-4 flex gap-2">
        {(['ethiopian', 'gregorian'] as CalendarMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'rounded-lg px-4 py-1 text-xs font-medium transition-colors capitalize cursor-pointer',
              mode === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'ethiopian' ? (
        <>
          {/* Selected day detail panel */}
          {selectedDay ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2">
              <p className="text-xs font-semibold text-foreground">
                {monthAmharic} {selectedDay} · {currentYear}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {monthName} {selectedDay}, {currentYear} ET
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Click a day to select it
            </div>
          )}

          {/* Ethiopian header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={goToPrevMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              ←
            </button>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{monthAmharic}</p>
              <p className="text-xs text-muted-foreground">{monthName} · {currentYear}</p>
            </div>
            <button
              onClick={goToNextMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              →
            </button>
          </div>

          {/* Amharic day of week headers — 7 columns now, same as Gregorian */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK_AM.map((d) => (
              <p key={d} className="text-center text-[10px] font-medium text-muted-foreground">
                {d}
              </p>
            ))}
          </div>

          {/* Ethiopian grid — now 7 columns with weekday offset */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells to offset the 1st to the correct weekday column */}
            {Array.from({ length: etMonthStartDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {etDays.map((day) => {
              const isToday = day === todayET.day && currentMonth === todayET.month && currentYear === todayET.year
              const isSelected = day === selectedDay
              const isDimmed = selectedDay !== null && !isSelected && !isToday

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={cn(
                    'rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer',
                    isToday && 'bg-primary text-primary-foreground scale-105',
                    isSelected && !isToday && 'bg-muted text-foreground ring-1 ring-border',
                    hoveredDay === day && !isSelected && !isToday && 'bg-muted/60 scale-105',
                    isDimmed && 'opacity-30',
                    !isToday && !isSelected && hoveredDay !== day && 'text-muted-foreground'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <button
            onClick={goToToday}
            className="mt-4 w-full rounded-lg bg-muted py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            Today
          </button>
        </>
      ) : (
        <>
          {/* Selected day detail panel */}
          {selectedDay ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2">
              <p className="text-xs font-semibold text-foreground">
                {GC_MONTHS[gcMonth]} {selectedDay} · {gcYear}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Gregorian Calendar
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Click a day to select it
            </div>
          )}

          {/* Gregorian header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={goToPrevGcMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              ←
            </button>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{GC_MONTHS[gcMonth]}</p>
              <p className="text-xs text-muted-foreground">{gcYear}</p>
            </div>
            <button
              onClick={goToNextGcMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              →
            </button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK_EN.map((d) => (
              <p key={d} className="text-center text-[10px] font-medium text-muted-foreground">
                {d}
              </p>
            ))}
          </div>

          {/* Gregorian grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {gcDays.map((day) => {
              const isToday =
                day === today.getDate() &&
                gcMonth === today.getMonth() &&
                gcYear === today.getFullYear()
              const isSelected = day === selectedDay
              const isDimmed = selectedDay !== null && !isSelected && !isToday

              return (
                <button
                  key={day}
                  onClick={() => {
                    const newSelected = day === selectedDay ? null : day
                    setSelectedDay(newSelected)
                  }}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={cn(
                    'rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer',
                    isToday && 'bg-primary text-primary-foreground scale-105',
                    isSelected && !isToday && 'bg-muted text-foreground ring-1 ring-border',
                    hoveredDay === day && !isSelected && !isToday && 'bg-muted/60 scale-105',
                    isDimmed && 'opacity-30',
                    !isToday && !isSelected && hoveredDay !== day && 'text-muted-foreground'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => { setGcMonth(today.getMonth()); setGcYear(today.getFullYear()) }}
            className="mt-4 w-full rounded-lg bg-muted py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            Today
          </button>
        </>
      )}
    </div>
  )
}