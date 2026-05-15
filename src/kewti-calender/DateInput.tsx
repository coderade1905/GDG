"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EthiopianCalendar } from "./EthiopianCalendar"

export function EthiopianDatePicker({setUserDate, className, style }: {setUserDate: (date: Date) => void, className?: string, style?: React.CSSProperties}) {
  const [date, setDate] = React.useState<Date>()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            className,
            style,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent" align="start">
        <EthiopianCalendar
          value={date}
          onDateSelect={(newDate) => {
            if (!newDate) return
            setDate(newDate)
            setUserDate(newDate)
            setIsOpen(false) 
          }}
        />
      </PopoverContent>
    </Popover>
  )
}