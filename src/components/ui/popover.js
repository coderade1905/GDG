"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
function Popover({ ...props }) {
    return _jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({ ...props }) {
    return _jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({ className, align = "center", sideOffset = 4, ...props }) {
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { "data-slot": "popover-content", align: align, sideOffset: sideOffset, className: cn("z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className), ...props }) }));
}
function PopoverAnchor({ ...props }) {
    return _jsx(PopoverPrimitive.Anchor, { "data-slot": "popover-anchor", ...props });
}
function PopoverHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "popover-header", className: cn("flex flex-col gap-0.5 text-sm", className), ...props }));
}
function PopoverTitle({ className, ...props }) {
    return (_jsx("div", { "data-slot": "popover-title", className: cn("font-medium", className), ...props }));
}
function PopoverDescription({ className, ...props }) {
    return (_jsx("p", { "data-slot": "popover-description", className: cn("text-muted-foreground", className), ...props }));
}
export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger, };
