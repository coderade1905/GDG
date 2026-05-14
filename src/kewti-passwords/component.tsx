"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Check, X } from "lucide-react"
import mascotImage from "./mascot.png"

/* ──────────────────────────────────────────────
   Strength helpers
   ────────────────────────────────────────────── */

type StrengthLevel = 0 | 1 | 2 | 3 | 4

interface StrengthRule {
    label: string
    test: (pw: string) => boolean
}

const RULES: StrengthRule[] = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw) => /\d/.test(pw) },
    { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

function getStrength(password: string): StrengthLevel {
    if (!password) return 0
    const passed = RULES.filter((r) => r.test(password)).length
    if (passed <= 1) return 1
    if (passed <= 2) return 2
    if (passed <= 3) return 3
    return 4
}

const STRENGTH_CONFIG: Record<
    StrengthLevel,
    { label: string; color: string; bgColor: string }
> = {
    0: { label: "", color: "", bgColor: "bg-muted" },
    1: { label: "Weak", color: "text-red-500", bgColor: "bg-red-500" },
    2: { label: "Fair", color: "text-amber-500", bgColor: "bg-amber-500" },
    3: { label: "Good", color: "text-sky-500", bgColor: "bg-sky-500" },
    4: { label: "Strong", color: "text-emerald-500", bgColor: "bg-emerald-500" },
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

interface KewtiPasswordProps {
    /** Placeholder text */
    placeholder?: string
    /** Show the strength meter & rule checklist */
    showStrength?: boolean
    /** External change handler */
    onChange?: (value: string) => void
    /** Controlled value */
    value?: string
    /** Label text above the input */
    label?: string
    /** Extra wrapper classes */
    className?: string
    /** Slot for a mascot or illustration above the input */
    mascot?: React.ReactNode
}

export function KewtiPassword({
    placeholder = "Enter password",
    showStrength = true,
    onChange,
    value: controlledValue,
    label = "Password",
    className,
    mascot,
}: KewtiPasswordProps) {
    const [internalValue, setInternalValue] = React.useState("")
    const [visible, setVisible] = React.useState(false)
    const [focused, setFocused] = React.useState(false)
    const [eyePosition, setEyePosition] = React.useState({ x: 0, y: 0 })
    const mascotRef = React.useRef<HTMLDivElement>(null)

    const password = controlledValue ?? internalValue
    const strength = getStrength(password)
    const config = STRENGTH_CONFIG[strength]

    // Eye tracking effect
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!mascotRef.current) return

            const rect = mascotRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Calculate angle to cursor
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
            const distance = 8 // Max distance eyeballs can move within sockets

            setEyePosition({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
            })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value
        if (controlledValue === undefined) setInternalValue(next)
        onChange?.(next)
    }

    return (
        <div className={cn("mx-auto w-full max-w-sm", className)}>
            {/* ── Mascot Zone ───────────────────────── */}
            <div className="flex items-end justify-center">
                <div
                    className={cn(
                        "relative -mb-px flex items-end justify-center transition-transform duration-300",
                        focused && "scale-105",
                    )}
                    ref={mascotRef}
                >
                    {mascot ? (
                        mascot
                    ) : (
                        /* Mascot illustration with eyes ready for interactivity */
                        <div className="flex flex-col items-center gap-2 pb-2">
                            <div
                                className={cn(
                                    "relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border-2 transition-all duration-300",
                                    focused
                                        ? "border-primary/30 shadow-lg shadow-primary/10"
                                        : "border-muted/40 shadow-sm",
                                )}
                            >
                                {/* Mascot Image Container */}
                                <img
                                    src={mascotImage}
                                    alt="Mascot"
                                    className="h-full w-full object-cover transition-transform duration-300"
                                    loading="lazy"
                                />
                                
                                {/* Eyes Container with tracking eyeballs */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    data-eyes-container="true"
                                >
                                    {/* Left Eye */}
                                    <div
                                        className="absolute w-2 h-2 rounded-full bg-black border border-black shadow-md"
                                        style={{
                                            left: "35%",
                                            top: "50%",
                                            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                                            transition: "transform 0.1s ease-out",
                                        }}
                                    >
                                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: "2px", left: "2px" }} />
                                    </div>

                                    {/* Right Eye */}
                                    <div
                                        className="absolute w-2 h-2 rounded-full bg-black border border-black shadow-md"
                                        style={{
                                            right: "35%",
                                            top: "50%",
                                            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                                            transition: "transform 0.1s ease-out",
                                        }}
                                    >
                                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: "2px", left: "2px" }} />
                                    </div>
                                </div>
                            </div>
                            {/* little tab that connects to the card */}
                            <div
                                className={cn(
                                    "h-2 w-16 rounded-t-md transition-colors duration-300",
                                    focused ? "bg-primary/15" : "bg-muted/50",
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Card ──────────────────────────────── */}
            <div
                className={cn(
                    "rounded-2xl border bg-background p-5 shadow-sm transition-all duration-300",
                    focused
                        ? "border-primary/30 shadow-md shadow-primary/5 ring-1 ring-primary/10"
                        : "border-border",
                )}
            >
                {/* Label */}
                {label && (
                    <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {label}
                    </label>
                )}

                {/* Input row */}
                <div className="relative">
                    <input
                        id="kewti-password-input"
                        type={visible ? "text" : "password"}
                        value={password}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={placeholder}
                        autoComplete="new-password"
                        className={cn(
                            "peer h-11 w-full rounded-xl border bg-transparent px-4 pr-12 text-sm outline-none transition-all duration-200",
                            "placeholder:text-muted-foreground/60",
                            "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
                            "dark:bg-input/20",
                        )}
                    />

                    {/* Toggle visibility */}
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Hide password" : "Show password"}
                        className={cn(
                            "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors",
                            "hover:bg-muted hover:text-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        )}
                    >
                        {visible ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* ── Strength meter ───────────────── */}
                {showStrength && password.length > 0 && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
                        {/* Bar */}
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex flex-1 gap-1">
                                {([1, 2, 3, 4] as const).map((level) => (
                                    <div
                                        key={level}
                                        className={cn(
                                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                                            strength >= level
                                                ? config.bgColor
                                                : "bg-muted",
                                        )}
                                    />
                                ))}
                            </div>
                            <span
                                className={cn(
                                    "text-[11px] font-medium tabular-nums tracking-wide transition-colors duration-300",
                                    config.color,
                                )}
                            >
                                {config.label}
                            </span>
                        </div>

                        {/* Rule checklist */}
                        <ul className="space-y-1">
                            {RULES.map((rule) => {
                                const passed = rule.test(password)
                                return (
                                    <li
                                        key={rule.label}
                                        className={cn(
                                            "flex items-center gap-1.5 text-[11px] transition-colors duration-200",
                                            passed
                                                ? "text-emerald-500"
                                                : "text-muted-foreground/70",
                                        )}
                                    >
                                        {passed ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            <X className="h-3 w-3" />
                                        )}
                                        {rule.label}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
