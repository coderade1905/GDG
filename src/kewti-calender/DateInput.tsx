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

export function EthiopianDatePicker() {
  // This state holds ONLY the standard Gregorian Date object
  const [date, setDate] = React.useState<Date>()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
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
            setDate(newDate)
            if (newDate) setIsOpen(false) // Auto-close when a day is picked
          }}
        />
      </PopoverContent>
    </Popover>
  )
}