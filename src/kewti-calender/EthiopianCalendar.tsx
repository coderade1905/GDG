import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

import { getHolidaysForYear, HolidayTags } from 'kenat'

import { useEthiopianCalendar } from './useEthiopianCalendar'
import {
  getEthiopianMonthStartDay,
  toGregorianDate,
  toEthiopianDate
} from './utils'

type HolidayData = {
  name: string
  description: string
}

function buildHolidaysMap(
  etYear: number
): Record<string, HolidayData> {
  const map: Record<string, HolidayData> = {}

  try {
    const holidays = getHolidaysForYear(etYear, {
      filter: HolidayTags.PUBLIC
    })

    holidays.forEach((h) => {
      const key = `${h.ethiopian.year}-${h.ethiopian.month}-${h.ethiopian.day}`

      map[key] = {
        name: h.name,
        description: h.description
      }
    })
  } catch (error) {
    console.error('Failed to load holidays from kenat:', error)
  }

  return map
}

type CalendarMode = 'ethiopian' | 'gregorian'

interface EthiopianCalendarProps {
  value?: Date
  onDateSelect?: (date?: Date) => void
}

const GC_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const DAYS_OF_WEEK_EN = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

const DAYS_OF_WEEK_AM = [
  'እሑድ',
  'ሰኞ',
  'ማክሰኞ',
  'ረቡዕ',
  'ሐሙስ',
  'ዓርብ',
  'ቅዳሜ'
]

export function EthiopianCalendar({
  value,
  onDateSelect
}: EthiopianCalendarProps) {
  const [mode, setMode] =
    useState<CalendarMode>('ethiopian')

  const [hoveredDay, setHoveredDay] =
    useState<number | null>(null)

  // TEMP SELECTION
  const [tempDate, setTempDate] = useState<
    Date | undefined
  >(value)

  // HOLIDAYS
  const [holidaysMap, setHolidaysMap] = useState<
    Record<string, HolidayData>
  >({})

  const today = new Date()

  const [gcMonth, setGcMonth] = useState(
    value ? value.getMonth() : today.getMonth()
  )

  const [gcYear, setGcYear] = useState(
    value ? value.getFullYear() : today.getFullYear()
  )

  useEffect(() => {
    setTempDate(value)
  }, [value])

  const {
    currentMonth,
    currentYear,
    today: todayET,
    daysInCurrentMonth,
    monthName,
    monthAmharic,
    goToPrevMonth,
    goToNextMonth,
    goToToday
  } = useEthiopianCalendar()

  useEffect(() => {
    const etDateForGc = toEthiopianDate(
      new Date(gcYear, gcMonth, 15)
    )

    const targetYear =
      mode === 'ethiopian'
        ? currentYear
        : etDateForGc.year

    setHolidaysMap({
      ...buildHolidaysMap(targetYear - 1),
      ...buildHolidaysMap(targetYear),
      ...buildHolidaysMap(targetYear + 1)
    })
  }, [currentYear, gcYear, gcMonth, mode])

  const etDays = Array.from(
    { length: daysInCurrentMonth },
    (_, i) => i + 1
  )

  const etMonthStartDay =
    getEthiopianMonthStartDay(
      currentMonth,
      currentYear
    )

  const daysInGcMonth = new Date(
    gcYear,
    gcMonth + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    gcYear,
    gcMonth,
    1
  ).getDay()

  const gcDays = Array.from(
    { length: daysInGcMonth },
    (_, i) => i + 1
  )

  const goToPrevGcMonth = () => {
    if (gcMonth === 0) {
      setGcMonth(11)
      setGcYear((y) => y - 1)
    } else {
      setGcMonth((m) => m - 1)
    }
  }

  const goToNextGcMonth = () => {
    if (gcMonth === 11) {
      setGcMonth(0)
      setGcYear((y) => y + 1)
    } else {
      setGcMonth((m) => m + 1)
    }
  }

  const etSelected = tempDate
    ? toEthiopianDate(tempDate)
    : null

  const isSelectedInCurrentEtView =
    etSelected?.month === currentMonth &&
    etSelected?.year === currentYear

  const isSelectedInCurrentGcView =
    tempDate?.getMonth() === gcMonth &&
    tempDate?.getFullYear() === gcYear

  const selectedHoliday = etSelected
    ? holidaysMap[
    `${etSelected.year}-${etSelected.month}-${etSelected.day}`
    ]
    : null

  return (
    <div className="w-fit rounded-xl border bg-background p-4 shadow-sm">
      <div className="mb-4 flex gap-2">
        {(
          ['ethiopian', 'gregorian'] as CalendarMode[]
        ).map((m) => (
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
          {tempDate &&
            isSelectedInCurrentEtView &&
            etSelected ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-foreground">
                  {monthAmharic} {etSelected.day} ·{' '}
                  {etSelected.year} ET
                </p>

                {selectedHoliday && (
                  <span
                    title={selectedHoliday.description}
                    className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold cursor-help"
                  >
                    {selectedHoliday.name}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-muted-foreground mt-1">
                ={' '}
                {
                  GC_MONTHS[
                  tempDate.getMonth()
                  ]
                }{' '}
                {tempDate.getDate()},{' '}
                {tempDate.getFullYear()} GC
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Click a day to select it
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={goToPrevMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              ←
            </button>

            <div className="text-center">
              <p className="text-base font-bold text-foreground">
                {monthAmharic}
              </p>

              <p className="text-xs text-muted-foreground">
                {monthName} · {currentYear}
              </p>
            </div>

            <button
              onClick={goToNextMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK_AM.map((d) => (
              <p
                key={d}
                className="text-center text-[10px] font-medium text-muted-foreground"
              >
                {d}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({
              length: etMonthStartDay
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {etDays.map((day) => {
              const isToday =
                day === todayET.day &&
                currentMonth === todayET.month &&
                currentYear === todayET.year

              const isSelected =
                etSelected?.day === day &&
                etSelected?.month === currentMonth &&
                etSelected?.year === currentYear

              const isDimmed =
                tempDate &&
                !isSelected &&
                !isToday

              const holiday =
                holidaysMap[
                `${currentYear}-${currentMonth}-${day}`
                ]

              return (
                <button
                  key={day}
                  title={
                    holiday
                      ? `${holiday.name}\n${holiday.description}`
                      : undefined
                  }
                  onClick={() => {
                    if (isSelected) {
                      setTempDate(undefined)
                    } else {
                      setTempDate(
                        toGregorianDate(
                          day,
                          currentMonth,
                          currentYear
                        )
                      )
                    }
                  }}
                  onMouseEnter={() =>
                    setHoveredDay(day)
                  }
                  onMouseLeave={() =>
                    setHoveredDay(null)
                  }
                  className={cn(
                    'relative rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center',
                    isToday &&
                    'bg-primary text-primary-foreground scale-105',
                    isSelected &&
                    !isToday &&
                    'bg-muted text-foreground ring-1 ring-border',
                    hoveredDay === day &&
                    !isSelected &&
                    !isToday &&
                    'bg-muted/60 scale-105',
                    isDimmed && 'opacity-30',
                    holiday &&
                    !isToday &&
                    !isSelected &&
                    'text-red-500 font-bold',
                    !isToday &&
                    !isSelected &&
                    !holiday &&
                    hoveredDay !== day &&
                    'text-muted-foreground'
                  )}
                >
                  {day}

                  {holiday && (
                    <span
                      className={cn(
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isToday || isSelected
                          ? 'bg-background'
                          : 'bg-red-500'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                goToToday()
                setTempDate(new Date())
              }}
              className="w-full rounded-lg bg-muted py-2 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Today
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setTempDate(undefined)}
                className="flex-1 rounded-lg border py-2 text-xs hover:bg-muted transition-colors"
              >
                Clear
              </button>

              <button
                onClick={() => onDateSelect?.(tempDate)}
                className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {tempDate &&
            isSelectedInCurrentGcView &&
            etSelected ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-foreground">
                  {
                    GC_MONTHS[
                    tempDate.getMonth()
                    ]
                  }{' '}
                  {tempDate.getDate()} ·{' '}
                  {tempDate.getFullYear()} GC
                </p>

                {selectedHoliday && (
                  <span
                    title={selectedHoliday.description}
                    className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold cursor-help"
                  >
                    {selectedHoliday.name}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-muted-foreground mt-1">
                = {etSelected.month}/
                {etSelected.day}/
                {etSelected.year} ET
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Click a day to select it
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={goToPrevGcMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              ←
            </button>

            <div className="text-center">
              <p className="text-base font-bold text-foreground">
                {GC_MONTHS[gcMonth]}
              </p>

              <p className="text-xs text-muted-foreground">
                {gcYear}
              </p>
            </div>

            <button
              onClick={goToNextGcMonth}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK_EN.map((d) => (
              <p
                key={d}
                className="text-center text-[10px] font-medium text-muted-foreground"
              >
                {d}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({
              length: firstDayOfMonth
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {gcDays.map((day) => {
              const isToday =
                day === today.getDate() &&
                gcMonth === today.getMonth() &&
                gcYear === today.getFullYear()

              const isSelected =
                tempDate?.getDate() === day &&
                tempDate?.getMonth() === gcMonth &&
                tempDate?.getFullYear() ===
                gcYear

              const isDimmed =
                tempDate &&
                !isSelected &&
                !isToday

              const mappedEtDate =
                toEthiopianDate(
                  new Date(gcYear, gcMonth, day)
                )

              const holiday =
                holidaysMap[
                `${mappedEtDate.year}-${mappedEtDate.month}-${mappedEtDate.day}`
                ]

              return (
                <button
                  key={day}
                  title={
                    holiday
                      ? `${holiday.name}\n${holiday.description}`
                      : undefined
                  }
                  onClick={() => {
                    if (isSelected) {
                      setTempDate(undefined)
                    } else {
                      setTempDate(
                        new Date(
                          gcYear,
                          gcMonth,
                          day
                        )
                      )
                    }
                  }}
                  onMouseEnter={() =>
                    setHoveredDay(day)
                  }
                  onMouseLeave={() =>
                    setHoveredDay(null)
                  }
                  className={cn(
                    'relative rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center',
                    isToday &&
                    'bg-primary text-primary-foreground scale-105',
                    isSelected &&
                    !isToday &&
                    'bg-muted text-foreground ring-1 ring-border',
                    hoveredDay === day &&
                    !isSelected &&
                    !isToday &&
                    'bg-muted/60 scale-105',
                    isDimmed && 'opacity-30',
                    holiday &&
                    !isToday &&
                    !isSelected &&
                    'text-red-500 font-bold',
                    !isToday &&
                    !isSelected &&
                    !holiday &&
                    hoveredDay !== day &&
                    'text-muted-foreground'
                  )}
                >
                  {day}

                  {holiday && (
                    <span
                      className={cn(
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isToday || isSelected
                          ? 'bg-background'
                          : 'bg-red-500'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setGcMonth(today.getMonth())
                setGcYear(today.getFullYear())
                setTempDate(new Date())
              }}
              className="w-full rounded-lg bg-muted py-2 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Today
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setTempDate(undefined)}
                className="flex-1 rounded-lg border py-2 text-xs hover:bg-muted transition-colors"
              >
                Clear
              </button>

              <button
                onClick={() => onDateSelect?.(tempDate)}
                className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}