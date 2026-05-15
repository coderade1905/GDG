"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { EthiopianCalendar } from "./EthiopianCalendar";
export function EthiopianDatePicker({ setUserDate, className, style }) {
    const [date, setDate] = React.useState();
    const [isOpen, setIsOpen] = React.useState(false);
    return (_jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-[280px] justify-start text-left font-normal", className, style, !date && "text-muted-foreground"), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), date ? format(date, "PPP") : _jsx("span", { children: "Pick a date" })] }) }), _jsx(PopoverContent, { className: "w-auto p-0 border-none shadow-none bg-transparent", align: "start", children: _jsx(EthiopianCalendar, { value: date, onDateSelect: (newDate) => {
                        if (!newDate)
                            return;
                        setDate(newDate);
                        setUserDate(newDate);
                        setIsOpen(false);
                    } }) })] }));
}
